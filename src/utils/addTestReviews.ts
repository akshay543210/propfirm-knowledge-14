import { supabase } from '@/integrations/supabase/client';

export const addTestReviews = async () => {
  const testReviews = [
    {
      firm_id: '1a37d3b1-bcff-44c2-aba4-c5c70328bb9a', // Funded7
      rating: 5,
      title: 'Excellent service!',
      content: 'Great prop firm with fast payouts and excellent support. Highly recommended for beginners.',
      reviewer_name: 'TraderJohn'
    },
    {
      firm_id: '1a37d3b1-bcff-44c2-aba4-c5c70328bb9a', // Funded7
      rating: 4,
      title: 'Good experience overall',
      content: 'Professional platform with good tools. Minor issues with customer support response time but overall satisfied.',
      reviewer_name: 'MarketMaster'
    },
    {
      firm_id: 'a89f8940-49da-459f-90ec-bf843dd8c824', // the5ers
      rating: 5,
      title: 'Top-notch platform',
      content: 'Amazing trading conditions and very reliable. Been trading with them for 6 months now.',
      reviewer_name: 'ProTrader99'
    },
    {
      firm_id: 'a89f8940-49da-459f-90ec-bf843dd8c824', // the5ers
      rating: 3,
      title: 'Average experience',
      content: 'Decent platform but had some issues with withdrawals. Customer service could be better.',
      reviewer_name: 'Anonymous'
    },
    {
      firm_id: '293d8d24-79bb-42bc-92de-b96fed7e8ca8', // Nostro
      rating: 4,
      title: 'Solid choice',
      content: 'Good profit splits and reasonable fees. Platform is stable and user-friendly.',
      reviewer_name: 'TradingExpert'
    }
  ];

  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert(testReviews)
      .select();

    if (error) {
      console.error('Error adding test reviews:', error);
      return false;
    }

    console.log('Successfully added test reviews:', data);
    return true;
  } catch (error) {
    console.error('Failed to add test reviews:', error);
    return false;
  }
};