const AdminFooter = () => {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="admin-footer text-center text-light py-4">
        <div className="container">
          <p className="mb-0 small">
            © {currentYear} BudgetBuddy - Panneau d'administration.
          </p>
        </div>
  
        <style>{`
          .admin-footer {
            background: #111827;
            font-size: 0.9rem;
            margin-top: auto;
          }
        `}</style>
      </footer>
    );
  };
  
  export default AdminFooter;
  