import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, Edit, Trash2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function Products() {
  const { data: products = [], refetch } = useProducts();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("0");
  const [status, setStatus] = useState<"pre_order" | "in_stock">("in_stock");
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<Array<{ id: string; url: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleEdit = async (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setEditingId(productId);
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setStockQuantity(String(product.stock_quantity || 0));
      setStatus(product.status as "pre_order" | "in_stock");
      setImages([]);
      
      const { data: imageRecords } = await supabase
        .from("product_images")
        .select("id, image_url")
        .eq("product_id", productId)
        .order("display_order");
      
      if (imageRecords) {
        setExistingImages(imageRecords.map(img => ({ id: img.id, url: img.image_url })));
      }
      
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const removeExistingImage = async (imageId: string, imageUrl: string) => {
    try {
      const filePath = imageUrl.split("/").slice(-2).join("/");
      await supabase.storage.from("product-images").remove([filePath]);
      await supabase.from("product_images").delete().eq("id", imageId);
      setExistingImages(existingImages.filter(img => img.id !== imageId));
      toast.success("Image removed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove image");
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const { data: imageRecords } = await supabase
        .from("product_images")
        .select("image_url")
        .eq("product_id", productId);

      if (imageRecords) {
        for (const record of imageRecords) {
          const filePath = record.image_url.split("/").slice(-2).join("/");
          await supabase.storage.from("product-images").remove([filePath]);
        }
      }

      await supabase.from("product_images").delete().eq("product_id", productId);
      const { error } = await supabase.from("products").delete().eq("id", productId);
      if (error) throw error;

      toast.success("Product deleted successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
    setDeleteId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !price) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!editingId && images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setUploading(true);

    try {
      let productId = editingId;

      if (editingId) {
        const { error: updateError } = await supabase
          .from("products")
          .update({ 
            name, 
            description, 
            price, 
            status,
            stock_quantity: parseInt(stockQuantity) || 0
          })
          .eq("id", editingId);

        if (updateError) throw updateError;
      } else {
        const { data: product, error: productError } = await supabase
          .from("products")
          .insert({ 
            name, 
            description, 
            price, 
            status,
            stock_quantity: parseInt(stockQuantity) || 0
          })
          .select()
          .single();

        if (productError) throw productError;
        productId = product.id;
      }

      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i];
          const fileExt = file.name.split(".").pop();
          const fileName = `${productId}/${Date.now()}-${i}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from("product-images")
            .getPublicUrl(fileName);

          const { error: imageError } = await supabase
            .from("product_images")
            .insert({
              product_id: productId,
              image_url: publicUrl,
              display_order: i,
            });

          if (imageError) throw imageError;
        }
      }

      toast.success(editingId ? "Product updated successfully!" : "Product added successfully!");
      
      resetForm();
      refetch();
      
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to add product");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setStockQuantity("0");
    setStatus("in_stock");
    setImages([]);
    setExistingImages([]);
  };

  const handleStockUpdate = async (productId: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ stock_quantity: newQuantity })
        .eq("id", productId);

      if (error) throw error;
      toast.success("Stock updated!");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update stock");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Products</h2>
        <p className="text-muted-foreground">Manage your store products</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Product" : "Add New Product"}</CardTitle>
            <CardDescription>
              {editingId ? "Update product details" : "Upload product images and details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Luxury Kids 2-Piece Set"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., MOQ: 30 sets"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., ₦20,000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    min="0"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Product Status</Label>
                <RadioGroup value={status} onValueChange={(value: "pre_order" | "in_stock") => setStatus(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in_stock" id="in_stock" />
                    <Label htmlFor="in_stock" className="cursor-pointer">In Stock</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pre_order" id="pre_order" />
                    <Label htmlFor="pre_order" className="cursor-pointer">Pre-Order (40-day landing)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload images
                    </span>
                  </Label>
                </div>

                {(existingImages.length > 0 || images.length > 0) && (
                  <div className="space-y-3 mt-3">
                    {existingImages.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Existing Images</p>
                        <div className="grid grid-cols-3 gap-2">
                          {existingImages.map((image) => (
                            <div key={image.id} className="relative group">
                              <img
                                src={image.url}
                                alt="Existing product"
                                className="w-full h-20 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeExistingImage(image.id, image.url)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {images.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">New Images</p>
                        <div className="grid grid-cols-3 gap-2">
                          {images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={uploading}>
                  {uploading ? "Uploading..." : editingId ? "Update Product" : "Add Product"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Products ({products.length})</CardTitle>
            <CardDescription>Edit or delete existing products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{product.description}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-sm font-medium">{product.price}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        product.status === "in_stock" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {product.status === "in_stock" ? "In Stock" : "Pre-order"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Label className="text-xs">Stock:</Label>
                      <Input
                        type="number"
                        min="0"
                        value={product.stock_quantity || 0}
                        onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value) || 0)}
                        className="h-7 w-20 text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button size="icon" variant="outline" onClick={() => handleEdit(product.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => setDeleteId(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No products yet. Add your first product.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this product and all its images. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}