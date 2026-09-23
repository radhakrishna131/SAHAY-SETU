import { Link } from 'wouter';
import { ArrowLeft, CircleAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="auth-page">
      <div className="auth-card" style={{textAlign:'center'}}>
        <div className="state-icon"><CircleAlert size={24}/></div>
        <div className="eyebrow" style={{marginTop:22}}>Wrong turn</div>
        <h1>That page isn’t on the map.</h1>
        <p>The page you’re looking for may have moved, or it may still be waiting to be built.</p>
        <Link href="/" className="button-primary" data-testid="link-not-found-home"><ArrowLeft size={15}/> Back to the community</Link>
      </div>
    </div>
  );
}
