import { pipeline } from "@xenova/transformers";

let generator = null;

const loadModel = async () => {
  if (generator) return generator;
  
  self.postMessage({ status: "loading" });
  
  // Using SmolLM-135M (~90MB on disk)
  // It's small, fast, and fits your <100MB requirement
  generator = await pipeline('text-generation', 'Xenova/SmolLM-135M-Instruct', {
    progress_callback: (p) => {
      if (p.status === 'progress') {
        self.postMessage({ status: "loading", progress: p.progress });
      }
    }
  });

  self.postMessage({ status: "ready" });
  return generator;
};

self.onmessage = async (event) => {
  const { action, text } = event.data;
  
  try {
    const pipe = await loadModel();
    
    let prompt = "";
    if (action === "rewrite") {
      prompt = `Rewrite this text to be clearer and more professional:\n\n${text}\n\nRewritten:`;
    } else if (action === "summarize") {
      prompt = `Summarize this text into a few key bullet points:\n\n${text}\n\nSummary:`;
    } else if (action === "formal") {
      prompt = `Change the tone of this text to be very formal and professional:\n\n${text}\n\nFormal:`;
    } else if (action === "casual") {
      prompt = `Change the tone of this text to be friendly and casual:\n\n${text}\n\nCasual:`;
    }

    const output = await pipe(prompt, {
      max_new_tokens: 128,
      temperature: 0.7,
      repetition_penalty: 1.2,
    });

    // Clean up the output to only return the generated part
    const result = output[0].generated_text.split(prompt.slice(-10))[1] || output[0].generated_text;
    
    self.postMessage({ 
      status: "done", 
      output: result.trim() 
    });

  } catch (error) {
    self.postMessage({ status: "error", error: error.message });
  }
};
