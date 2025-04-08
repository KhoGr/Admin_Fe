const BASE_URL = "http://localhost:4000"; 
interface GetImageProductParams {
    imgName: string;
}
interface currencyFormatParams{
    num:number;
}

export const getImageProduct = (imgName: GetImageProductParams['imgName']): string => {
    return `${BASE_URL}/assets/upload/products/${imgName}`;
};
export const currencyFormat= (num:currencyFormatParams['num']):string=> {
    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
 }
 console.log(currencyFormat(2665)); // $2,665.00