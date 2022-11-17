import Pagination from './pagination';
import Res from './res';

interface ResWithPagination<T> extends Res<T> {
  pagination: Pagination;
}

export default ResWithPagination;
