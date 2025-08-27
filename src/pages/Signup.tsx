import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await signUp(email, password);
      
      if (error) {
        console.error('Signup error:', error);
        toast({ 
          title: 'Signup failed', 
          description: error.message || 'An error occurred during signup', 
          variant: 'destructive' 
        });
      } else if (data.user) {
        console.log('Signup success:', data);
        toast({ 
          title: 'Account created successfully!', 
          description: 'Please check your email to verify your account before logging in.' 
        });
        navigate('/');
      }
    } catch (err) {
      console.error('Unexpected signup error:', err);
      toast({ 
        title: 'Signup failed', 
        description: 'An unexpected error occurred. Please try again.', 
        variant: 'destructive' 
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-blue-500/20">
        <CardHeader>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Sign up</h1>
            <p className="text-gray-400">Create a new account</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-700 border-slate-600 text-white" required />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-700 border-slate-600 text-white" required />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>
          <div className="mt-4 text-center text-gray-400">
            Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Log in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
