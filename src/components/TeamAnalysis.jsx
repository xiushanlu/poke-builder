export default function TeamAnalysis({teamIDs}){
    fetch(url, {...teamIDs});
}

const response = await fetch('/api/analyze-team', {
  method: 'POST', // 1. what kind of request
  headers: { 'Content-Type': 'application/json' }, // 2. a label: "the body is JSON"
  body: JSON.stringify({ ids: [6, 25, 3] }), // 3. the data, as text
})

const result = await response.json() // reading the answer: same as always