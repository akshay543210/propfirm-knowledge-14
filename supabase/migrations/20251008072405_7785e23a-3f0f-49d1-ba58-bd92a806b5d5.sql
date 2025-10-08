-- Update all existing prop firms to show on homepage
UPDATE prop_firms 
SET show_on_homepage = true 
WHERE show_on_homepage = false;

-- Add comment explaining the homepage visibility
COMMENT ON COLUMN prop_firms.show_on_homepage IS 'Controls whether the firm appears on the homepage. Set to true to display.';