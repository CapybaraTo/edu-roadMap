
/**
 * @description 列属性
 * @interface TableColumn
 * @prop {string} prop 实际属性名，相当于 key
 * @prop {string} label 列名/表头，相当于 value
 * @prop {number} width 控制列宽
 */
interface TableColumn {
  /** 属性名 */
  prop: string;
  /** 列名 */
  label: string;
  /** 可自定义宽度 */
  width?: number;
}
type ID = string | number;

/**
 * @description 别名：列属性数组
 */
type TableColList = TableColumn[];
export interface ResData<T> {
  data?: T;
  msg?: string;
  code?: number;
  status?: string;
  rows?: T[];
  total?: string | number;
}

type RespError = {
  msg: string;
  code: number;
};

/**
 * @description 构建一个表格组件所需的基本属性
 * @interface TableProps
 * @prop {TableColList} columns 列属性数组
 * @prop {string} tableTitle 可选属性,表格标题
 * @prop {hasButton} hasButton 是否包含按钮,默认false
 * @prop {buttonText} buttonText 可选属性,按钮文字
 */
interface PageParams {
  pageNum: number;
  pageSize: number;
}
interface TableProps {
  /** 列属性数组 */
  columns: TableColList;
  /** 表格标题 */
  tableTitle?: string;
  /** 按钮选项 */
  hasButton?: boolean;
  /** 按钮文字 */
  buttonText?: string;
}
// type UserType = '-1' | '0' | '1' | '2' | '30' | '31';
