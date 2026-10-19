import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dtcuximjpssuhlmrbwgi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0Y3V4aW1qcHNzdWhsbXJid2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzODY4NDgsImV4cCI6MjEwNzk2Mjg0OH0.mRjkVP2Ba6WVIjHBM0DrYhirGEHFd6KATWa9Qz2EvI8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
  console.log("Checking Supabase connection...");
  const { data, error } = await supabase.from("projects").select("*").limit(1);
  if (error) {
    console.log("Status: Connected to Supabase, but table 'projects' not created yet.");
    console.log("Supabase Error Code:", error.code, "-", error.message);
  } else {
    console.log("Status: SUCCESS! Table 'projects' exists and is ready.");
    console.log("Data count:", data.length);
  }
}

checkConnection();
