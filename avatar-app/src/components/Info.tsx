// src/components/Info.tsx

export const Info: React.FC = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-3">How It Works</h2>
      <p className="lead mb-4">
        {" "}
        {/* Use text-white-50 if background is dark */}
        Learn about the technology behind the Multimodal Synthetic Avatar
        Cloning System.
      </p>

      {/* Use Bootstrap cards or sections for content */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100 text-dark p-3">
            <div className="card-body">
              <h4 className="card-title" style={{ color: "#6c5ce7" }}>
                1. Avatar Generation
              </h4>
              <p className="card-text">
                We use state-of-the-art Generative Adversarial Networks (GANs)
                or Diffusion Models trained on vast datasets of human faces.
                Based on your text description (or an uploaded image), the model
                synthesizes a realistic or stylized 2D portrait matching the
                requested features and style.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 text-dark p-3">
            <div className="card-body">
              <h4 className="card-title" style={{ color: "#6c5ce7" }}>
                2. Voice Cloning
              </h4>
              <p className="card-text">
                Our voice cloning module utilizes advanced deep learning
                techniques like Tacotron or VITS. By analyzing a short audio
                sample of your voice, it captures your unique pitch, tone, and
                cadence. This allows it to generate new speech in your voice
                from any text input.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 text-dark p-3">
            <div className="card-body">
              <h4 className="card-title" style={{ color: "#6c5ce7" }}>
                3. Facial Animation
              </h4>
              <p className="card-text">
                To bring the avatar to life, we employ AI models that predict
                realistic lip movements (visemes) synchronized with the
                synthesized speech audio. Additional models can generate subtle
                facial expressions like blinking, head movements, and emotional
                cues based on the text's sentiment or specific commands.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 text-dark p-3">
            <div className="card-body">
              <h4 className="card-title" style={{ color: "#6c5ce7" }}>
                4. Integration
              </h4>
              <p className="card-text">
                Finally, the generated avatar image, the synthesized speech, and
                the facial animation data are combined. This results in a video
                or real-time rendering of your digital avatar speaking the
                provided text naturally, mimicking both your appearance (as
                generated) and your cloned voice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
