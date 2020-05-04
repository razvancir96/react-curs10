import React from 'react';
import Layout from '../components/Layout';
// Avem nevoie de vectorul de produse.
import products from '../utils/products.json';
import './Product.css';
// Trebuie sa ne conectam la store, pentru a dispatch-ui actiunea de addToCart.
import { connect } from 'react-redux';
import { addToCart } from '../redux/actions/cart';

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product: {}
        }
    }

    componentDidMount() {
        // Id-ul produsului este luat din ruta.
        const { match } = this.props;
        const productId = match.params.productId;
        // In JSON-ul products avem un obiecte care are drept chei categoriile. Vrem sa preluam informatiile
        // despre categorii si sa le punem intr-un array.
        const categoryValues = Object.values(products);
        console.log(categoryValues);

        // Ne cream o variabila in care vom stoca datele despre produsul curent
        let currentProduct;

        // Trebuie sa parcurgem fiecare categorie
        categoryValues.forEach((category) => {
            // Si sa cautam in itemii categoriei produsul cu id-ul similar celui din ruta
            // Cum functioneaza find:
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
            const findResult = category.items.find((product) => {
                // Cu typeof puteti verifica tipul si SURPRIZA: unul e string, altul e number... => CONVERTIM
                // NU PUNETI ==, CONVERTITI!
                console.log(typeof productId, typeof product.id);
                return product.id === Number(productId);
            });
            // Daca am gasit produsul, il salvam in variabila currentProduct
            if (findResult) {
                currentProduct = findResult;
            }
        });

        // La final, actualizam state-ul
        this.setState({product: currentProduct});
    }

    render() {
        const { product } = this.state;

        return (
            <Layout>
                <div className="product-page content-min-height container-fluid container-min-max-width">
                    {/* Adaugam markup-ul pentru pagina de produs */}
                    <h1 className="my-5 h2">{product.name}</h1>
                    {/* Am aduagat clase pentru stilizarea pe mobile */}
                    <div className="product-info d-flex">
                        <div className="image-wrapper d-flex mr-5">
                            <img src={product.image} alt="Product presentation"/>
                        </div>
                        <div className="product-details">
                            <p className="h3 text-danger">{product.price} {product.currency}</p>
                            <button
                                className="btn btn-dark mb-4 font-weight-bold"
                                // La click pe buton, adaugam in cart-ul din store.
                                onClick={() => {
                                    this.props.addToCart({
                                        product: {
                                            id: product.id,
                                            name: product.name,
                                            price: product.price,
                                            currency: product.currency,
                                            image: product.image
                                        }
                                    })
                                }}
                            >
                                Adaugă în coș
                            </button>
                            <p><span className="font-weight-bold">Mărime</span>: {product.size}</p>
                            <p><span className="font-weight-bold">Culoare</span>: {product.colour}</p>
                            <p><span className="font-weight-bold">Material</span>: {product.material}</p>
                            <p><span className="font-weight-bold">Brand</span>: {product.brand}</p>
                            <p className="font-weight-bold mb-1">Descriere:</p>
                            <p>{product.description}</p>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}

// Avem nevoie sa ne conectam la store si sa aducem in props dispatch-ul metodei addToCart.
function mapDispatchToProps(dispatch) {
    return {
        addToCart: (payload) => dispatch(addToCart(payload))
    }
}

export default connect(null, mapDispatchToProps)(Product);