const Candidate = require('../models/Candidate');
const axios = require('axios');

// Add Candidate
exports.addCandidate = async (req, res) => {
    try {
        const { name, email, skills, experience, bio } = req.body;
        const candidate = new Candidate({ name, email, skills, experience, bio });
        await candidate.save();
        res.status(201).json({ message: 'Candidate added successfully', candidate });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Candidates
exports.getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Basic Skill Matching
exports.matchCandidates = async (req, res) => {
    try {
        const { requiredSkills, minExperience } = req.body;
        const candidates = await Candidate.find();

        const results = candidates.map(candidate => {
            const matchedSkills = candidate.skills.filter(skill => 
                requiredSkills.some(reqSkill => skill.toLowerCase().includes(reqSkill.toLowerCase()))
            );
            
            const matchScore = (matchedSkills.length / requiredSkills.length) * 100;
            const meetsExperience = candidate.experience >= minExperience;

            let rank = 'Low';
            if (matchScore >= 70 && meetsExperience) rank = 'High';
            else if (matchScore >= 40 && meetsExperience) rank = 'Medium';

            return {
                ...candidate._doc,
                matchScore: Math.round(matchScore),
                matchedSkills,
                meetsExperience,
                rank
            };
        });

        // Sort by match score descending
        results.sort((a, b) => b.matchScore - a.matchScore);

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// AI-Based Shortlisting (OpenRouter)
exports.aiShortlist = async (req, res) => {
    try {
        const { requiredSkills, minExperience, preferredSkills } = req.body;
        const candidates = await Candidate.find();

        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(500).json({ error: 'OpenRouter API Key not configured' });
        }

        const candidateList = candidates.map((c, i) => `${i+1}. ${c.name} - Skills: ${c.skills.join(', ')} - Experience: ${c.experience} years - Bio: ${c.bio || 'N/A'}`).join('\n');

        const prompt = `
Job requires: ${requiredSkills.join(', ')} (${minExperience}+ years experience). 
Preferred: ${preferredSkills?.join(', ') || 'None'}.

Candidates:
${candidateList}

Rank the candidates and explain why. Return a JSON array of objects with the following structure:
[
  {
    "name": "Candidate Name",
    "rank": "High/Medium/Low",
    "explanation": "Brief explanation why",
    "score": 0-100
  }
]
Only return the JSON array.
`;

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'google/gemini-2.0-flash-lite-001', // Using a highly reliable model
            messages: [{ role: 'user', content: prompt }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://talentmatch.ai',
                'X-Title': 'Candidate Shortlisting System',
                'Content-Type': 'application/json'
            }
        });

        const content = response.data.choices[0].message.content.trim();
        // Extract JSON if it's wrapped in markdown code blocks
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        const jsonStr = jsonMatch ? jsonMatch[0] : content;
        
        try {
            const aiResults = JSON.parse(jsonStr);
            res.status(200).json(aiResults);
        } catch (parseError) {
            console.error('AI JSON Parse Error:', content);
            res.status(500).json({ error: 'AI returned invalid format. Please try again.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'AI analysis failed: ' + error.message });
    }
};

// Generic Chat Assistant
exports.chatAssistant = async (req, res) => {
    try {
        const { message, context } = req.body;
        
        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(500).json({ error: 'OpenRouter API Key not configured' });
        }

        const systemPrompt = `You are a helpful recruitment assistant for the TalentMatch AI platform. 
        You help recruiters with candidate analysis, job descriptions, and interview tips. 
        Current context: ${JSON.stringify(context || 'None')}`;

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'google/gemini-2.0-flash-lite-001',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://localhost:3000',
                'X-Title': 'Candidate Shortlisting System',
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: 'Chat failed: ' + error.message });
    }
};
