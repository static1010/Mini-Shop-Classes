class Product {
    // title = 'DEFAULT'
    // imageUrl
    // description
    // price
    constructor(title, image, price, desc) {
        this.title = title;
        this.imageUrl = image;
        this.price = price;
        this.description = desc;
    }
}

class ElementAttribute {
    constructor(attrName, attrValue) {
        this.name = attrName;
        this.value = attrValue;
    }
}

class Component {
    constructor(renderHookId, shouldRender = true) {
        this.hookId = renderHookId;
        if (shouldRender) {
            this.render();
        }
    }
    render() {}

    creatRootElement(tag, cssClasses, attributes) {
        const rootElement = document.createElement(tag);
        if (cssClasses) {
            rootElement.className = cssClasses;
        }
        if (attributes && attributes.length > 0) {
            for (const attr of attributes) {
                rootElement.setAttribute(attr.name, attr.value);
            }
        }
        document.getElementById(this.hookId).append(rootElement);
        return rootElement;
    }
}

class ShoppingCart extends Component {
    items = [];

    set carItems(value) {
        this.items = value;
        this.totalOutput.innerHTML = `<h2>Total: ${this.totalAmount.toFixed(
      2
    )}</h2>`;
    }

    get totalAmount() {
        const sum = this.items.reduce(
            (prevValue, curItem) => prevValue + curItem.price,
            0
        );
        return sum;
    }

    constructor(renderHookId) {
        super(renderHookId, false);
        this.orderProduct = () => {
            console.log(this.items);
        }
        this.render()
    }

    addProduct(product) {
        const updateItems = [...this.items];
        updateItems.push(product);
        this.carItems = updateItems;
    }


    render() {
        const cartEl = this.creatRootElement("section", "cart");
        cartEl.innerHTML = `
            <h2>Total:${0}</h2>
            <button>Order Now!</button>
        `;
        const orderButton = cartEl.querySelector('button')
        orderButton.addEventListener('click', this.orderProduct)
        this.totalOutput = cartEl.querySelector("h2");
    }
}

class ProductItem extends Component {
    constructor(product, renderHookId) {
        super(renderHookId, false);
        this.product = product;
        this.render()
    }

    addToCart() {
        App.addProductToCart(this.product);
    }

    render() {

        const prodEl = this.creatRootElement("li", "product-item");
        prodEl.innerHTML = `
      <div>
       <img src="${this.product.imageUrl}" alt="${this.product.title}">
       <div class="product-item__content">
       <h2>${this.product.title}</h2>
       <h3>${this.product.price}</h3>
       <p>${this.product.description}</p>
       <button>Add to Card</button>

         </div>
      </div>
    `;

        const addCartButton = prodEl.querySelector("button");
        addCartButton.addEventListener("click", this.addToCart.bind(this));
    }
}

class ProductList extends Component {
    products = [];
    constructor(renderHookId) {
        super(renderHookId);
        this.fetchProducts();
    }

    fetchProducts() {
        this.products = [
            new Product(
                "A pillow",
                "img/Pillow.jpg",
                19.99,
                "A soft pilow"
            ),
            new Product(
                "A Carpet",
                "img/Carpet.png",
                89.99,
                "A some carpet"
            ),
        ];
        this.renderProducts();
    }

    renderProducts() {
        for (const prod of this.products) {
            new ProductItem(prod, "prod-list");
        }
    }

    render() {
        this.creatRootElement("ul", "product-list", [
            new ElementAttribute("id", "prod-list"),
        ]);
        if (this.products && this.products.length > 0) {
            this.renderProducts();
        }
    }
}

class Shop {
    constructor() {
        this.render();
    }

    render() {
        this.cart = new ShoppingCart("app");
        new ProductList("app");
    }
}

class App {
    static cart;

    static init() {
        const shop = new Shop();

        this.cart = shop.cart;
    }

    static addProductToCart(product) {
        this.cart.addProduct(product);
    }
}

App.init();