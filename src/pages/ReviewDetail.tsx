
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft, Check, X, TrendingUp, Users, Clock, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Dummy detailed review data
const dummyReviewDetails = {
  "ftmo": {
    name: "FTMO",
    rating: 4.8,
    trustScore: "9.2/10",
    category: "Big",
    badge: "Most Popular",
    description: "FTMO stands as the gold standard in proprietary trading firms. With over 8 years in the market, they've built an impressive reputation through consistent payouts, fair evaluation processes, and excellent customer support.",
    pros: [
      "Excellent customer support",
      "Fair evaluation process",
      "Consistent payouts",
      "Well-established reputation",
      "Comprehensive educational resources"
    ],
    cons: [
      "Higher evaluation fees",
      "Strict risk management rules",
      "Limited trading hours on some instruments"
    ],
    statistics: {
      fundingAmount: "$400K",
      successRate: "90%",
      avgPayout: "$155",
      avgTime: "1-3 days"
    },
    companyInfo: {
      founded: "2015",
      headquarters: "Prague, Czech Republic",
      regulation: "EU Regulated",
      categories: ["Forex", "Indices", "Commodities", "Crypto"]
    },
    tradingConditions: {
      evaluationType: "Two Phase",
      maxDrawdown: "10%",
      profitTarget: "8%",
      leverage: "1:100",
      dailyLoss: "5%",
      refundPolicy: "Available",
      newsTrading: "Allowed",
      weekendHolding: "Allowed"
    }
  },
  "the-funded-trader": {
    name: "The Funded Trader",
    rating: 4.6,
    trustScore: "8.8/10",
    category: "Big",
    badge: "Editor's Choice",
    description: "The Funded Trader brings innovation to the prop trading space with their flexible evaluation models and trader-friendly policies.",
    pros: [
      "Innovative evaluation models",
      "Trader-friendly policies",
      "One-step evaluation available",
      "Good profit splits",
      "Active community support"
    ],
    cons: [
      "Newer company",
      "Limited track record",
      "Higher fees for instant funding"
    ],
    statistics: {
      fundingAmount: "$300K",
      successRate: "85%",
      avgPayout: "$125",
      avgTime: "2-5 days"
    },
    companyInfo: {
      founded: "2020",
      headquarters: "London, UK",
      regulation: "FCA Regulated",
      categories: ["Forex", "Indices", "Commodities"]
    },
    tradingConditions: {
      evaluationType: "One/Two Phase",
      maxDrawdown: "8%",
      profitTarget: "6%",
      leverage: "1:50",
      dailyLoss: "4%",
      refundPolicy: "Available",
      newsTrading: "Restricted",
      weekendHolding: "Not Allowed"
    }
  },
  "myforexfunds": {
    name: "MyForexFunds",
    rating: 4.5,
    trustScore: "8.5/10",
    category: "Big",
    badge: "Fast Growing",
    description: "MyForexFunds has quickly established itself as a major player in the prop trading industry with instant funding options.",
    pros: [
      "Instant funding available",
      "No evaluation required option",
      "Good profit splits",
      "Fast payouts",
      "Modern platform"
    ],
    cons: [
      "Higher risk with instant funding",
      "Newer company",
      "Limited educational resources"
    ],
    statistics: {
      fundingAmount: "$200K",
      successRate: "80%",
      avgPayout: "$95",
      avgTime: "1-2 days"
    },
    companyInfo: {
      founded: "2021",
      headquarters: "Dubai, UAE",
      regulation: "ADGM Regulated",
      categories: ["Forex", "Indices"]
    },
    tradingConditions: {
      evaluationType: "Instant/One Phase",
      maxDrawdown: "12%",
      profitTarget: "10%",
      leverage: "1:30",
      dailyLoss: "6%",
      refundPolicy: "Limited",
      newsTrading: "Allowed",
      weekendHolding: "Allowed"
    }
  }
};

const ReviewDetail = () => {
  const { slug } = useParams();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [reviewData, setReviewData] = useState(null);

  useEffect(() => {
    if (slug && dummyReviewDetails[slug]) {
      setReviewData(dummyReviewDetails[slug]);
    }
  }, [slug]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
        }`}
      />
    ));
  };

  if (!reviewData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-red-400">Review not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
      
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link 
          to="/reviews"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reviews
        </Link>

        {/* Main Review Card */}
        <Card className="bg-slate-800/50 border-blue-500/20 mb-8">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{reviewData.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(reviewData.rating)}</div>
                    <span className="text-white font-semibold text-lg">{reviewData.rating}</span>
                    <span className="text-gray-400">Expert Rating</span>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {reviewData.badge}
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-lg">{reviewData.description}</p>
          </CardHeader>
        </Card>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-blue-500/20 text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{reviewData.statistics.fundingAmount}</div>
              <div className="text-gray-400 text-sm">Max Funding</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-blue-500/20 text-center">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{reviewData.statistics.successRate}</div>
              <div className="text-gray-400 text-sm">Success Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-blue-500/20 text-center">
            <CardContent className="p-6">
              <Shield className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{reviewData.statistics.avgPayout}</div>
              <div className="text-gray-400 text-sm">Avg Payout</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-blue-500/20 text-center">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{reviewData.statistics.avgTime}</div>
              <div className="text-gray-400 text-sm">Payout Time</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pros and Cons */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-green-500/20">
              <CardHeader>
                <h3 className="text-xl font-bold text-green-400">✓ Pros</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {reviewData.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-red-500/20">
              <CardHeader>
                <h3 className="text-xl font-bold text-red-400">✗ Cons</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {reviewData.cons.map((con, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <X className="h-4 w-4 text-red-400 flex-shrink-0" />
                      <span className="text-gray-300">{con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Company Information & Trading Conditions */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <h3 className="text-xl font-bold text-white">Company Information</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Founded</span>
                    <span className="text-white">{reviewData.companyInfo.founded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Headquarters</span>
                    <span className="text-white">{reviewData.companyInfo.headquarters}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Regulation</span>
                    <span className="text-white">{reviewData.companyInfo.regulation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Categories</span>
                    <span className="text-white">{reviewData.companyInfo.categories.join(", ")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardHeader>
                <h3 className="text-xl font-bold text-white">Trading Conditions</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Evaluation Type</span>
                    <span className="text-white">{reviewData.tradingConditions.evaluationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Drawdown</span>
                    <span className="text-white">{reviewData.tradingConditions.maxDrawdown}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Profit Target</span>
                    <span className="text-white">{reviewData.tradingConditions.profitTarget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Leverage</span>
                    <span className="text-white">{reviewData.tradingConditions.leverage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Daily Loss</span>
                    <span className="text-white">{reviewData.tradingConditions.dailyLoss}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Refund Policy</span>
                    <span className="text-white">{reviewData.tradingConditions.refundPolicy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">News Trading</span>
                    <span className="text-white">{reviewData.tradingConditions.newsTrading}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Weekend Holding</span>
                    <span className="text-white">{reviewData.tradingConditions.weekendHolding}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 mt-8">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to start trading with {reviewData.name}?</h3>
            <p className="text-gray-300 mb-6">Join thousands of successful traders who trust {reviewData.name}</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              Start Trading Now
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default ReviewDetail;
