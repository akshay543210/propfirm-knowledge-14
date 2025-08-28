
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user, isAdmin, loading } = useAuth();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate("/admin-dashboard-2024");
    }
  }, [user, isAdmin, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const { data, error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    } else if (data.user) {
      console.log('AdminLogin: Login successful, user:', data.user.email);
      toast({
        title: "Login Successful",
        description: "Redirecting to admin panel...",
      });

      // Navigate immediately so the admin panel shows; AdminRoute will enforce access
      navigate('/admin-dashboard-2024');

      // Fire-and-forget admin verification for logs (does not block navigation)
      supabase.rpc('is_admin').then(({ data: isAdminResult, error: adminErr }) => {
        if (adminErr) {
          console.error('Admin check failed:', adminErr);
        } else {
          console.log('Admin check result:', isAdminResult);
        }
      });

      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-blue-500/20">
        <CardHeader>
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-gray-400">Access the PropFirmHub admin panel</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter admin email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter admin password"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded p-2">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login to Admin Panel"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400 bg-slate-700/30 rounded p-3">
            <p className="font-medium text-gray-300 mb-1">Admin Access Required</p>
            <p>Only registered admin users can access the dashboard.</p>
            <p>Contact your administrator for access.</p>
          </div>
          
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-blue-400"
            >
              ← Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
