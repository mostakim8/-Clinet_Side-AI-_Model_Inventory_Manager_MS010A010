const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-4 mt-8">
      <div className="container mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} AI Model Inventory Manager. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;