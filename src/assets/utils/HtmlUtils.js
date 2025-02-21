import {calculatePrices, displayAmountFormat} from './CommonUtils';
import moment from 'moment';
import {Image} from 'react-native';

export const constructHTML = (company, customer, selectedProducts) => {
  const toalObj = calculatePrices(selectedProducts);
  let today = moment().format('DD-MM-YYYY');

  const signImage = `<img src="${
    Image.resolveAssetSource(require('../images/quoateSign.png')).uri
  }" width='150' height='60' />`;
  const companyDetails = `<p> <strong>${company.name}</strong><br/>
  ${
    company.addressOne +
    '<br/>' +
    company.addressTwo +
    '<br/>' +
    company.city +
    '-' +
    company.pincode +
    ',' +
    company.state
  }<br/>
  GSTIN:${company.gstIn}<br/>
  Phone:${company.phoneOne + ', ' + company.phoneTwo}<br/>
  E-mail:${company.email}<br/>
  </p>`;

  const bankDetails = `<p>
  <strong>Bank Account Details:</strong><br />
  BISMI MOULDS AND TRAYS<br />
  ${company.bankName}<br />
  Account no: ${company.accountNumber}<br />
  Branch IFSC NO: ${company.ifscode}
  </p>`;

  const cusomerDetails = `<p class="left-align">
  <strong>To:</strong><br />
  <b>${customer.name}</b><br/>
    ${
      customer.addressOne +
      '<br/>' +
      customer.addressTwo +
      '<br/>' +
      customer.city +
      '-' +
      customer.pincode
    }<br/>
    ${customer.phone} <br/>  ${customer.gstNo}</p>`;

  let products = '';
  selectedProducts.forEach((item, index) => {
    const productSubTotal = item.quantity * item.price;
    products =
      products +
      `<tr>
    <td>${index + 1}</td>
    <td>
    ${item.name} ${item.weight} <br/>
    ${item.sizeInMM && item.sizeInMM != '' ? item.sizeInMM : ''} &nbsp; ${
        item.sizeInInches && item.sizeInInches != ''
          ? '(' + item.sizeInInches + ')'
          : ''
      }
    </td>
    <td>${company.hsnCode}</td>
    <td>${item.quantity.toString()}</td>
    <td>${item.price.toString()}</td>
    <td>${displayAmountFormat(productSubTotal)}</td>
    </tr>  ${
      index === 6 && selectedProducts.length > 7
        ? '<tr class="spacer"><td></td></tr> '
        : ''
    }`;
  });

  const dataSpace =
    selectedProducts.length > 2 && selectedProducts.length < 5
      ? 'always'
      : 'avoid';

  const htmlContent = `
  <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Quotation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
      }
      h1 {
        text-align: center;
        color: #a84442;
      }
      p{
        line-height: 1.5;
      }
      ol{
        line-height: 1.5;
      }
      table {
        width: 100%;
        empty-cells: hide; 
	      border-collapse: separate;
	      border-spacing: 0px;	
        margin-bottom: 20px;
      }
      tr{
        page-break-inside: avoid !important;
      }
      td {
        border: 1px solid #000;
        padding: 8px;
        text-align: center;
      }
      th {
        border: 1px solid #000;
        padding: 8px;
        text-align: center;
        background-color: #a84442;
        text-align: center;
        color: #ffffff;
      }
      tfoot{
        page-break-inside: avoid !important;
        display:table-row-group;
      } 
      .terms {
        margin-top: 20px;
        page-break-inside: avoid !important;
        page-break-before: ${dataSpace};
      }
      .company{
        display: flex;
        margin-top: 20px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-right: 30px;
      }
      .signature {
        display: flex;
        margin-top: 10px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
      .signatureContainer {
        display: flex;
        margin-top: 10px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .left-align {
        text-align: left;
      }
      .pageBreak{
        position: running(absolute);
        bottom:0;
        width:100%;
        background-color: #a84442;
        padding-top: 10px;
        padding-bottom: 10px;
        color: #ffffff;
        text-align: center;
      }
      .spacer { 
        height: 100px; /* Adjust height as needed */ 
      }
    </style>
  </head>

  <body>
    <h1>Quotation</h1>
    <div class="company">
      ${companyDetails}
      ${cusomerDetails}
    </div
    <br />
    ${bankDetails}
    <table>
      <thead style="display:table-row-group">
        <tr>
          <th>S.No</th>
          <th>Description</th>
          <th>HSN Code</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
      ${products}
      </tbody>
      <tfoot>
      <tr>
      <td style='border:none;'/>
      <td style='border:none;'/>
      <td style='border:none;'/>
      <td style='border:none;'/>
      <td><strong>Sub Total:</strong></td>
        <td >${displayAmountFormat(toalObj.subTotal)}</td>
      </tr>
      <tr>
      <td style='border:none;'/>
      <td style='border:none;'/>
      <td style='border:none;'/>
      <td style='border:none;'/>
      <td><strong>IGST (18%):</strong></td>
      <td >${displayAmountFormat(toalObj.sgst + toalObj.cgst)}</td>
      </tr>
      <tr>
        <td style='border:none;'/>
        <td style='border:none;'/>
        <td style='border:none;'/>
        <td style='border:none;'/>
        <td><strong>Total:</strong></td>
        <td >${displayAmountFormat(toalObj.grandTotal)}</td>
      </tr>
    </tfoot>
    </table>
    <div class="terms">
      <h3>Terms and Condition:</h3>
      <ol>
        <li>
          <strong
            >Quotation is valid for a period of 30 days from the date of
            issue</strong
          >
        </li>
        <li><strong>Transportation charges are not applicable</strong></li>
        <li><strong>Order will be delivered within 15 days</strong></li>
      </ol>
    </div>
    <div class="signature">
    <div><strong>Date: </strong>${today}</div>
    <div class="signatureContainer">
     ${signImage}
     <strong>Signature</strong>
    </div>
  </div>
  </body>
  </html>`;
  return htmlContent;
};

//<div id="pageBreak"> Thank You for Your Business! </div>
