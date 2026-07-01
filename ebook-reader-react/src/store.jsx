import {configureStore} from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import userReducer from './reducers/user';
import bookReducer from './reducers/book';
import reviewReducer from './reducers/review';
import messageReducer from './reducers/message';
import cartReducer from './reducers/cart';
import orderReducer from './reducers/order';
import paymentReducer from './reducers/payment';
import bookFormatReducer from './reducers/book.format';
import authorReducer from './reducers/author';
import categoryReducer from './reducers/category';
import publisherReducer from './reducers/publisher';
import tagReducer from './reducers/tag';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    book: bookReducer,
    review: reviewReducer,
    message: messageReducer,
    cart: cartReducer,
    order: orderReducer,
    payment: paymentReducer,
    bookFormat: bookFormatReducer,
    author: authorReducer,
    category: categoryReducer,
    publisher: publisherReducer,
    tag: tagReducer,
  },
});

export default store;