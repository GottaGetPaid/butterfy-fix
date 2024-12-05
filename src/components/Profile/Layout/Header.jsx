import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-butterfy-dark p-4">
      <div className="flex justify-center">
        <Link to="/" className="text-4xl font-bigshot font-bold">
          Butterfy
        </Link>
      </div>
    </header>
  );
}