import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught an error:', error, info);
    }
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <>
                    <div className="container flex" style={{ height: '100vh' }}>
                        <section className="left flex direction-col">
                            <p className="heading grey">{window.location.href}</p>
                            <p className="title error">{this.props.error}</p>
                            {console.log(this.props.errorCode)}
                            {this.props.errorCode === 404 && (<p className="heading error">The pgae you are trying to visist, dosent exist!</p>)}
                        </section>
                    </div>
                </>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;