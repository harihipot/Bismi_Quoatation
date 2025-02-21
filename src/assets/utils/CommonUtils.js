export const calculatePrices = selectedProducts => {
  let subTotal = 0;
  let cgst = 0;
  let sgst = 0;
  let grandTotal = 0;
  selectedProducts.map(item => {
    const productSubTotal = item.quantity * item.price;
    subTotal = subTotal + productSubTotal;
  });

  cgst = Math.round(subTotal * (9 / 100));
  sgst = Math.round(subTotal * (9 / 100));

  grandTotal = Math.round(subTotal + cgst + sgst);
  return {subTotal, cgst, sgst, grandTotal};
};

export const displayAmountFormat = amount => {
  let x = amount.toString();
  var lastThree = x.substring(x.length - 3);
  var otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers != '') lastThree = ',' + lastThree;
  var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return res
};

export const objectValuesEmpty = obj => {
  return Object.values(obj).every(v => v.length > 0);
};