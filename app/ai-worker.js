import { pipeline } from "@xenova/transformers";

let generator = null;

const loadModel = async () => {
  if (generator) return generator;
  
  self.postMessage({ status: "loading", message: "Initialing AI..." });
  
  // Using Qwen2.5-0.5B-Instruct - much smarter than SmolLM and still very small
  // We use the 4-bit quantized version for maximum speed
  try {
    generator = await pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct', {
      device: 'wasm', // wasm is most compatible
      progress_callback: (p) => {
        if (p.status === 'progress') {
          self.postMessage({ status: "loading", progress: p.progress, message: `Downloading AI: ${Math.round(p.progress)}%` });
        }
      }
    });
    self.postMessage({ status: "ready" });
  } catch (err) {
    console.error("Model load error:", err);
    // Fallback to SmolLM if Qwen fails for some reason
    generator = await pipeline('text-generation', 'Xenova/SmolLM-135M-Instruct');
  }

  return generator;
};

self.onmessage = async (event) => {
  const { action, text } = event.data;
  
  try {
    const pipe = await loadModel();
    
    let instruction = "";
    if (action === "rewrite") {
      instruction = "Rewrite the following text to be clearer, more professional, and concise. Only provide the rewritten text.";
    } else if (action === "summarize") {
      instruction = "Summarize the following text into 3 short bullet points. Be extremely brief.";
    }

    // Qwen-style Chat Template
    const prompt = `<|im_start|>system\nYou are a helpful assistant.<|im_end|>\n<|im_start|>user\n${instruction}\n\nTEXT:\n${text}<|im_end|>\n<|im_start|>assistant\n`;

    self.postMessage({ status: "loading", message: "AI is thinking..." });

    const output = await pipe(prompt, {
      max_new_tokens: 128,
      temperature: 0.2, // Lower temperature for faster, more focused output
      repetition_penalty: 1.1,
      stop_sequence: ["<|im_end|>", "<|endoftext|>"],
      return_full_text: false,
    });

    let result = output[0].generated_text;
    
    // Clean up if the template tags leaked in
    result = result.replace("<|im_start|>assistant\n", "").replace("<|im_end|>", "").trim();
    
    self.postMessage({ 
      status: "done", 
      output: result 
    });

  } catch (error) {
    console.error("AI Worker Error:", error);
    self.postMessage({ status: "error", error: error.message });
  }
};
