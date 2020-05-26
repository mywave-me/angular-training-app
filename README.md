# Training App

The Training App is for use during MyWave AI JS SDK training. The Training App is targeted at Angular 1.7 developers. During training we will be doing exercises using the Training App. 

The Training App is a simple partial implementation of a UI using the JS SDK. It is not intended to be production ready. 


<br />

## Running locally

* Clone or download the repo
* Open `index.html` in a browser
* Verify it is setup by running through the 'I want an extension on my electricity bill' conversation

<br />

## More Information
For more information refer to the documentation provided with the training:
   * JS SDK document
   * Training slides



## Note for Google Analytics

Confirm: Live agent required?

Category - Conversation
Action - Start, Interaction, Answered, End
Label (optional, but recommended) - Question / Prompt
Value (optional) - a non-negative integer that will appear as the event value



sample
https://developers.google.com/analytics/devguides/collection/gtagjs/events
gtag('event', <action>, {
  'event_category': <category>,
  'event_label': <label>,
  'value': <value>
});