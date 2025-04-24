// src/components/Footer.tsx

export const Footer: React.FC = () => {
  return (
    // Added border-top for separation, adjust text color if needed
    <footer className="text-center py-3 mt-auto border-top border-secondary">
      <p className="mb-0 small">
        {" "}
        {/* Adjusted text color and size */}© {new Date().getFullYear()} Avatar
        Cloning System. All rights reserved.
      </p>
    </footer>
  );
};
