-- Check if we have any prop firms to work with
DO $$
DECLARE
    sample_firm_id UUID;
    budget_count INTEGER;
    top_count INTEGER;
BEGIN
    -- Get a sample firm ID
    SELECT id INTO sample_firm_id FROM prop_firms LIMIT 1;
    
    -- Check current counts
    SELECT COUNT(*) INTO budget_count FROM budget_prop;
    SELECT COUNT(*) INTO top_count FROM top5_prop;
    
    -- Add sample data if tables are empty and we have a firm
    IF sample_firm_id IS NOT NULL THEN
        IF budget_count = 0 THEN
            INSERT INTO budget_prop (propfirm_id) VALUES (sample_firm_id);
            RAISE NOTICE 'Added sample firm to budget_prop';
        END IF;
        
        IF top_count = 0 THEN
            INSERT INTO top5_prop (propfirm_id) VALUES (sample_firm_id);
            RAISE NOTICE 'Added sample firm to top5_prop';
        END IF;
    ELSE
        RAISE NOTICE 'No prop firms found in database';
    END IF;
END $$;