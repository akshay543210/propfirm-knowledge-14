export type DramaType = 
  | 'Payout Delay'
  | 'Account Ban'
  | 'Rule Change'
  | 'Suspicious Activity'
  | 'Shutdown'
  | 'Other';

export type DramaSeverity = 'Low' | 'Medium' | 'High' | 'Scam Alert';

export type DramaStatus = 'Pending' | 'Approved' | 'Rejected';

export interface DramaReport {
  id: string;
  firm_name: string;
  date_reported: string;
  drama_type: DramaType;
  description: string;
  source_links?: string[];
  severity: DramaSeverity;
  status: DramaStatus;
  submitted_by?: string;
  admin_approved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DramaReportInsert {
  firm_name: string;
  date_reported: string;
  drama_type: DramaType;
  description: string;
  source_links?: string[];
  severity: DramaSeverity;
  submitted_by: string;
}