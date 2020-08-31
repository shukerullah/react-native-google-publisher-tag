import React from "react";
import { Linking } from "react-native";
import debounce from "lodash.debounce";
import { WebView, WebViewProps } from "react-native-webview";

import publisher from "./publisher";

function warn(...params) {
  // eslint-disable-next-line no-console
  console.warn(...params);
}

const _debounce = debounce((press, url) => {
  if (press) {
    press(url);
  } else {
    Linking.openURL(url).catch((er) => {
      warn(er);
    });
  }
}, 300);

function getAdUnitTargeting(adUnitTargeting) {
  if (!adUnitTargeting) {
    return "";
  }
  const unitTargeting = [];
  Object.keys(adUnitTargeting).forEach((key) => {
    let value = adUnitTargeting[key];
    // Array
    if (Array.isArray(value)) {
      value = value.map((val) => `"${val}"`);
      value = `[${value}]`;
    }
    // String
    else if (typeof value === "string") {
      value = `"${value}"`;
    }
    unitTargeting.push(`.setTargeting("${key}", ${value})`);
  });
  return unitTargeting.join("");
}

type Props = {
  width?: number,
  adUnitId: string,
  adUnitSize: string,
  adUnitTargeting: ?Object,
  baseUrl: ?string,
  backgroundColor: ?string,
  onPress: ?Function,
  impressionViewable?: Function,
  slotOnload?: Function,
  slotRenderEnded?: Function,
  slotRequested?: Function,
  slotResponseReceived?: Function,
  slotVisibilityChanged?: Function,
  ...WebViewProps,
};

type State = {
  width: number,
  height: number,
};
export default class GPT extends React.PureComponent<Props, State> {
  webView: WebView;

  initialUrl;

  html;

  static defaultProps = {
    width: "100%",
    impressionViewable: () => {},
    slotOnload: () => {},
    slotRenderEnded: () => {},
    slotRequested: () => {},
    slotResponseReceived: () => {},
    slotVisibilityChanged: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      width: props.width,
      height: 0,
    };

    this.html = publisher(
      props.adUnitId,
      props.adUnitSize,
      getAdUnitTargeting(props.adUnitTargeting),
      props.backgroundColor
    );
  }

  _onShouldStartLoadWithRequest = (request) => {
    if (!request || !request.url) {
      return true;
    }

    if (request.url.startsWith("blob")) {
      this._onPress(request.url);
      return false;
    }

    if (request.url.startsWith("intent:")) {
      this._onPress(request.url);
      return false;
    }

    if (request.url.startsWith("https://adssettings.google.com/whythisad")) {
      this._onPress(request.url);
      return false;
    }

    if (
      request.url.startsWith("tel:") ||
      request.url.startsWith("mailto:") ||
      request.url.startsWith("maps:") ||
      request.url.startsWith("geo:") ||
      request.url.startsWith("sms:")
    ) {
      this._onPress(request.url);
      return false;
    }
    return true;
  };

  _onNavigationStateChange = ({ url }) => {
    if (!this.initialUrl) {
      this.initialUrl = url;
    }

    if (url && url !== this.initialUrl) {
      this.webView.stopLoading();
      this._onPress(url);
    }
  };

  _onMessage = (info: Object) => {
    if (this.props.onMessage) {
      this.props.onMessage(info);
    }

    try {
      const { nativeEvent } = info;
      const data = JSON.parse(nativeEvent.data);

      if (data.height) {
        const { height } = data;
        if (height !== this.state.height) {
          this.setState({
            height,
          });
        }
      }

      if (data.impressionViewable) {
        this.props.impressionViewable(data.impressionViewable);
      }

      if (data.slotOnload) {
        this.props.slotOnload(data.slotOnload);
      }

      if (data.slotRenderEnded) {
        this.props.slotRenderEnded(data.slotRenderEnded);

        let width = 0;
        let height = 0;
        if (data.slotRenderEnded.size && data.slotRenderEnded.size.length > 1) {
          width = data.slotRenderEnded.size[0];
          height = data.slotRenderEnded.size[1];
        }
        const isFluid = width === 0 && height === 0;
        if (
          !isFluid &&
          (width !== this.state.width || height !== this.state.height)
        ) {
          this.setState({
            width,
            height,
          });
        }
      }

      if (data.slotRequested) {
        this.props.slotRequested(data.slotRequested);
      }

      if (data.slotResponseReceived) {
        this.props.slotResponseReceived(data.slotResponseReceived);
      }

      if (data.slotVisibilityChanged) {
        this.props.slotVisibilityChanged(data.slotVisibilityChanged);
      }
    } catch (er) {
      warn(er);
    }
  };

  async _onPress(url) {
    _debounce(this.props.onPress, url);
  }

  render() {
    const { baseUrl, ...rest } = this.props;
    const { width, height } = this.state;
    const style = {
      width,
      height,
    };

    return (
      <WebView
        ref={(ref) => {
          this.webView = ref;
        }}
        style={style}
        bounces={false}
        scrollEnabled={false}
        {...rest}
        onMessage={this._onMessage}
        source={{
          baseUrl,
          html: this.html,
        }}
        onNavigationStateChange={this._onNavigationStateChange}
        onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest}
      />
    );
  }
}
