export default function DSFooter() {
    return (
        <footer id="footer" className="footer py-5 bg-dark text-light mt-auto">
            <div className="container text-center">
                <h5 className="fw-bold mb-3">DiasporaStay</h5>
                <p className="mb-2">Connecting travelers and heritage — wherever life takes you.</p>
                <div className="d-flex justify-content-center gap-3 mb-3">
                    <a href="#" className="text-light"><i className="bi bi-facebook fs-4"></i></a>
                    <a href="#" className="text-light"><i className="bi bi-instagram fs-4"></i></a>
                    <a href="#" className="text-light"><i className="bi bi-twitter fs-4"></i></a>
                </div>
                <p className="small text-secondary mb-0">© {new Date().getFullYear()} DiasporaStay. All rights reserved.</p>
            </div>
        </footer>
    )
}
