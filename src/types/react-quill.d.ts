declare module "react-quill" {
  import * as React from "react";

  export interface QuillOptions {
    theme?: string;
    modules?: Record<string, unknown>;
    formats?: string[];
    placeholder?: string;
  }

  export interface ReactQuillProps extends QuillOptions {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    onBlur?: (previousRange: any, source: string, editor: any) => void;
    onFocus?: (range: any, source: string, editor: any) => void;
    onChangeSelection?: (range: any, source: string, editor: any) => void;
    className?: string;
    readOnly?: boolean;
    preserveWhitespace?: boolean;
    bounds?: string | HTMLElement;
    scrollingContainer?: string | HTMLElement;
  }

  export default class ReactQuill extends React.Component<ReactQuillProps> {}
}
