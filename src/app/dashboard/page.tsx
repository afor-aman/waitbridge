'use client'

import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card";
import { Trash2, Eye, Loader2, Crown, Lock, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

type Waitlist = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function Dashboard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [waitlists, setWaitlists] = useState<Waitlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(true);

  const fetchWaitlists = async () => {
    try {
      const res = await fetch("/api/waitlist");
      if (res.ok) {
        const data = await res.json();
        setWaitlists(data);
      }
    } catch (error) {
      console.error("Failed to fetch waitlists:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStatus = async () => {
    try {
      const res = await fetch("/api/user/payment-status");
      if (res.ok) {
        const data = await res.json();
        setIsPaid(data.payment || false);
      }
    } catch (error) {
      console.error("Failed to fetch payment status:", error);
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlists();
    fetchPaymentStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Waitlist created with id ${data.id}`);
        setName("");
        setDescription("");
        setOpen(false);
        fetchWaitlists(); // Refresh the list
      } else {
        const err = await res.text();
        alert(`Error: ${err}`);
      }
    } catch (error) {
      console.error("Failed to create waitlist:", error);
      alert("Failed to create waitlist");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/waitlist?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchWaitlists(); // Refresh the list
      } else {
        const err = await res.text();
        alert(`Error: ${err}`);
      }
    } catch (error) {
      console.error("Failed to delete waitlist:", error);
      alert("Failed to delete waitlist");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Show loading state
  if (paymentLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Hard paywall: Show upgrade screen for non-paid users
  if (!isPaid) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="max-w-lg w-full border-2 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 rounded-full bg-primary/10 p-4 w-fit">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Unlock Waitbridge</CardTitle>
            <CardDescription className="text-base mt-2">
              Get lifetime access to create unlimited waitlists and unlock all features with a one-time payment.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-4xl font-bold">$39</span>
                <span className="text-muted-foreground">one-time</span>
              </div>
              <ul className="space-y-3">
                {[
                  "Unlimited waitlists",
                  "Unlimited signups",
                  "Full customization",
                  "Analytics dashboard",
                  "Export data",
                  "No branding badge",
                  "All future updates",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full">
              <a
                href={process.env.NEXT_PUBLIC_CREEM_CHECKOUT_URL!}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Crown className="w-4 h-4 mr-2" />
                Get Lifetime Access
              </a>
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Secure payment via Creem. No subscription, pay once and own it forever.
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Welcome to Dashboard!</h1>
          <Badge variant="default" className="gap-1">
            <Crown className="w-3 h-3" />
            Pro
          </Badge>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Waitlist</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Waitlist</DialogTitle>
              <DialogDescription>
                Enter a name and optional description.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <DialogClose asChild>
                  <Button variant="outline" disabled={createLoading}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Waitlists</h2>
        {waitlists.length === 0 ? (
          <p className="text-muted-foreground">No waitlists yet. Create one to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {waitlists.map((waitlist) => (
              <Card 
                key={waitlist.id}
                className="hover:shadow-lg transition-shadow duration-200 border-border/50 hover:border-border"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{waitlist.name}</CardTitle>
                  {waitlist.description && (
                    <CardDescription className="line-clamp-2">
                      {waitlist.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardFooter className="pt-3 border-t gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/${waitlist.id}/edit`)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(waitlist.id, waitlist.name)}
                    disabled={deleteLoading === waitlist.id}
                    className="flex-1"
                  >
                    {deleteLoading === waitlist.id ? (
                      "Deleting..."
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}