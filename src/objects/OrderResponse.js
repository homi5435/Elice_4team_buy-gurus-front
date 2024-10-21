class OrderResponse {
  constructor(data) {
    this.orderId = data.orderId;
    this.createdAt = data.createdAt.split(".")[0].replace("T", " ");
    this.status = data.status;
    this.invoice = new Invoice(data.invoice);
    this.shippingFee = data.shippingFee;
    this.orderInfoList = data.orderInfoList.map(data => new OrderInfo(data));
    this.shippingAddress = new ShippingAddress(data.shippingAddress)
  }
}

class Invoice {
  constructor(invoiceInfo) {
    this.invoiceNum = invoiceInfo.invoiceNum;
    this.shippingCompany = invoiceInfo.shippingCompany;
  }
}

class OrderInfo {
  static errorImage = "https://cdn.pixabay.com/photo/2013/07/13/12/09/sign-159285_1280.png";
  constructor(orderInfo) {
    this.productId = orderInfo.productId;
    this.price = orderInfo.price;
    this.quantity = orderInfo.quantity;
    this.name = orderInfo.name;
    this.imageUrl = orderInfo.imageUrl ? orderInfo.imageUrl : OrderInfo.errorImage
    this.reviewed = orderInfo.reviewed;
  }
}

class ShippingAddress {
  constructor(shippingInfo) {
    this.address = shippingInfo.address;
    this.phoneNum = shippingInfo.phoneNum;
    this.name = shippingInfo.name;
  }
}

export {OrderResponse, OrderInfo, ShippingAddress};