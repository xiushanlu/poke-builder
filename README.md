# Pokemon Team Builder Project
Search for Pokemon, view their details, create a team of six, and analyze your team comp with this tool!

# Features
Pokemon search with moves, skills, and types for all valid Pokedex IDs
Random team generation (restricted to Pokedex IDs 1-1025)
Accounts and saving (WIP)
Styling (WIP)

# Decisions
Only one normalization function used, so search results and random teams have the same shape
Stellar, shadow, and unknown Pokemon types are excluded from analysis due to the API's lack on information on these types
Analysis response is grouped by attack type
For empty teams, a short "Add some" message is shown
