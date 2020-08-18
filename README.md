# react-native-google-publisher-tag

## Installtion

```shell
$ yarn add react-native-google-publisher-tag
```

or

```shell
$ npm install --save react-native-google-publisher-tag
```

_Note: You need to install [react-native-webview](https://github.com/react-native-community/react-native-webview)_ before using `react-native-google-publisher-tag`

## Example

```javascript
import GooglePublisherTag from 'react-native-google-publisher-tag';

<GooglePublisherTag
  adUnitId="/6499/example/APIDemo/AdSizes"
  adUnitSize="[[320, 50]]"
  baseUrl="https://your-domain.com"
  adUnitTargeting={{
    interest: 'basketball',
  }}
/>

<GooglePublisherTag
  adUnitId="/6499/example/APIDemo/AdSizes"
  adUnitSize="[[300, 250]]"
  baseUrl="https://your-domain.com"
  adUnitTargeting={{
    gender: 'male',
    age: '20-30',
  }}
/>

<GooglePublisherTag
  adUnitId="/6499/example/APIDemo/AdSizes"
  adUnitSize="[[300, 250], [728, 90], [750, 200]]"
  baseUrl="https://your-domain.com"
  adUnitTargeting={{
    gender: 'male',
    interests: ['sports', 'music', 'movies'],
    key: ['value1', 'value2', 'value3'],
  }}
  slotOnload={() => {
    // TODO: Do something on load
  }}
  onPress={(url) => {
    // Note: This will override Linking.openURL
    // Linking.openURL(url);
    // OR
    // InAppBrowser.open(url)
  }}
/>

<GooglePublisherTag
  adUnitId="/6499/example/APIDemo/Fluid"
  adUnitSize="[['fluid']]"
  width={414}
  baseUrl="https://your-domain.com"
/>
```

## Props

### adUnitId

Sets the AdUnit ID for all future ad requests.
| TYPE | REQUIRED |
| ------------- | ------------- |
| string | Yes |

### adUnitSize

Every ad slot you define must specify the ad size(s) eligible to serve in that slot. The way ad sizes are specified varies depending on the type of ads to be displayed, as well as the size and flexibility of the ad slots themselves. _Corresponding to [GPT Ad sizes](https://developers.google.com/doubleclick-gpt/guides/ad-sizes)_.
| TYPE | REQUIRED |
| ------------- | ------------- |
| string | Yes |

### adUnitTargeting

Ad unit targeting can be used to target ads more granularly than ad units. _Corresponding to [GPT Key-value targeting](https://developers.google.com/doubleclick-gpt/guides/key-value-targeting)_.
| TYPE | REQUIRED |
| ------------- | ------------- |
| string | No |

### baseUrl

| TYPE   | REQUIRED |
| ------ | -------- |
| string | Yes      |

### width

Width is not required but recommended for fluid and it effect only fluid size. By default its "100%".
| TYPE | REQUIRED |
| ------ | -------- |
| number | No |

### backgroundColor

| TYPE   | REQUIRED |
| ------ | -------- |
| string | No       |

### onPress

| TYPE     | REQUIRED |
| -------- | -------- |
| Function | No       |

### impressionViewable

_Reference: [googletag.events.ImpressionViewableEvent](https://developers.google.com/doubleclick-gpt/reference#googletag.events.impressionviewableevent)_.
| TYPE | REQUIRED |
| -------- | -------- |
| Function | No |

### slotOnload

_Reference: [googletag.events.SlotOnloadEvent](https://developers.google.com/doubleclick-gpt/reference#googletag.events.slotonloadevent)_.
| TYPE | REQUIRED |
| -------- | -------- |
| Function | No |

### slotRenderEnded

_Reference: [googletag.events.SlotRenderEndedEvent](https://developers.google.com/doubleclick-gpt/reference#googletag.events.slotrenderendedevent)_.
| TYPE | REQUIRED |
| -------- | -------- |
| Function | No |

### slotRequested

_Reference: [googletag.events.SlotRequestedEvent](https://developers.google.com/doubleclick-gpt/reference#googletag.events.slotrequestedevent)_.
| TYPE | REQUIRED |
| -------- | -------- |
| Function | No |

### slotResponseReceived

_Reference: [googletag.events.SlotResponseReceived](https://developers.google.com/doubleclick-gpt/reference#googletag.events.slotresponsereceived)_.
| TYPE | REQUIRED |
| -------- | -------- |
| Function | No |

### slotVisibilityChanged

_Reference: [googletag.events.SlotVisibilityChangedEvent](https://developers.google.com/doubleclick-gpt/reference#googletag.events.slotvisibilitychangedevent)_.
| TYPE | REQUIRED |
| -------- | -------- |
| Function | No |

### Follow me on Twitter: [@shukerullah](https://twitter.com/shukerullah)

<a href="https://www.buymeacoffee.com/shukerullah" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
