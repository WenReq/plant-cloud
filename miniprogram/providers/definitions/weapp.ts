// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Weapp {
  export interface FormField {
    data: {
      name: string;
      value: any;
    };
  }

  interface Target {
    id: string;
    tagName: string;
    dataset: {
      [key: string]: any;
    };
  }

  export interface Event {
    /**
     * 代表事件的类型。
     */
    type: string;
    /**
     * 页面打开到触发事件所经过的毫秒数。
     */
    timeStamp: number;
    /**
     * 触发事件的源组件。
     */
    target: Target;
    /**
     * 事件绑定的当前组件。
     */
    currentTarget: Target;
    /**
     * 额外的信息
     */
    detail: any;
  }

  /**
   * methods定义，miniprogram-api-typings缺少this定义
   */
  export interface MethodOption<Instance> {
    [name: string]: (this: Instance, ...args: any[]) => any;
  }

}
