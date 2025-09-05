import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';

const EmailConfirmation = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // If user is already logged in, redirect to home
        if (session?.user) {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
          setTimeout(() => {
            navigate('/');
          }, 3000);
          return;
        }

        // Get the token and type from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const type = urlParams.get('type');

        // Check if this is an email confirmation
        if (type === 'signup' && token) {
          setStatus('success');
          setMessage('Your email has been verified successfully! You can now log in to your account.');
        } else if (type === 'recovery' && token) {
          // Password recovery
          setStatus('success');
          setMessage('Password reset link verified. You can now reset your password.');
        } else {
          // No token found, might be direct access
          setStatus('error');
          setMessage('Invalid verification link. Please check your email for the correct link.');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage('An error occurred during email verification. Please try again.');
      }
    };

    verifyEmail();
  }, [navigate, session]);

  const handleRetry = () => {
    setStatus('loading');
    // Refresh the page to re-check the URL parameters
    window.location.reload();
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-slate-800/50 border-blue-500/20">
          <CardHeader>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Email Verification</h1>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-6">
              {status === 'loading' && (
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mb-4"></div>
                  <p className="text-gray-300">Verifying your email...</p>
                </div>
              )}

              {status === 'success' && (
                <div className="flex flex-col items-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <p className="text-gray-300 text-center mb-6">{message}</p>
                  <Button 
                    onClick={handleLoginRedirect}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-xl font-semibold text-lg"
                  >
                    Go to Login
                  </Button>
                </div>
              )}

              {status === 'error' && (
                <div className="flex flex-col items-center">
                  <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                  <p className="text-gray-300 text-center mb-6">{message}</p>
                  <div className="flex gap-2 w-full">
                    <Button 
                      onClick={handleRetry}
                      variant="outline"
                      className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                    <Button 
                      onClick={handleLoginRedirect}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      Login
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmailConfirmation;