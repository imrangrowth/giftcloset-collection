import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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

const Admin = () => {
  const navigate = useNavigate();
  const { data: products = [], refetch } = useProducts();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<"pre_order" | "in_stock">("in_stock");
  const [images, setImages] = useState<File[]>([]);
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

  const handleEdit = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setEditingId(productId);
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setStatus(product.status);
      setImages([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      // 1. Delete product images from storage
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

      // 2. Delete product_images records
      await supabase.from("product_images").delete().eq("product_id", productId);

      // 3. Delete product
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
        // Update existing product
        const { error: updateError } = await supabase
          .from("products")
          .update({ name, description, price, status })
          .eq("id", editingId);

        if (updateError) throw updateError;
      } else {
        // Create new product
        const { data: product, error: productError } = await supabase
          .from("products")
          .insert({ name, description, price, status })
          .select()
          .single();

        if (productError) throw productError;
        productId = product.id;
      }

      // Upload new images if any
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i];
          const fileExt = file.name.split(".").pop();
          const fileName = `${productId}/${Date.now()}-${i}.${fileExt}`;

          // Upload to storage
          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from("product-images")
            .getPublicUrl(fileName);

          // Create product_images record
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
      
      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setStatus("in_stock");
      setImages([]);
      setEditingId(null);
      
      // Refetch products
      refetch();
      
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to add product");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-32 pb-16">
        <div className="section-padding">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? "Edit Product" : "Add New Product"}</CardTitle>
                <CardDescription>
                  {editingId ? "Update product details" : "Upload product images and details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                    <Label>Product Status</Label>
                    <RadioGroup value={status} onValueChange={(value: "pre_order" | "in_stock") => setStatus(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="in_stock" id="in_stock" />
                        <Label htmlFor="in_stock" className="cursor-pointer">In Stock</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pre_order" id="pre_order" />
                        <Label htmlFor="pre_order" className="cursor-pointer">Pre-Order</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Images</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
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
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Click to upload images
                        </span>
                      </Label>
                    </div>

                    {images.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : editingId ? "Update Product" : "Add Product"}
                    </Button>
                    {editingId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingId(null);
                          setName("");
                          setDescription("");
                          setPrice("");
                          setStatus("in_stock");
                          setImages([]);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Existing Products */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Manage Products</CardTitle>
                <CardDescription>
                  Edit or delete existing products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <p className="text-sm font-medium mt-1">{product.price}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Status: {product.status === "pre_order" ? "Pre-Order" : "In Stock"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleEdit(product.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => setDeleteId(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No products yet. Add your first product above.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      {/* Delete Confirmation Dialog */}
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
};

export default Admin;
