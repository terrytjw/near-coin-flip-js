import 'regenerator-runtime/runtime'
import React from 'react'
import './assets/css/global.css'
import { callSmartContractFunction, viewBlockchainState } from './near-api'
import { EducationalText, NearInformation, SignInPrompt, SignOutButton } from './ui-components';

export default function App() {
  // Will store data returned from the blockchain in component state
  const [valueFromBlockchain, setValueFromBlockchain] = React.useState();

  const [uiPleaseWait, setUiPleaseWait] = React.useState(false);

  // If user not signed-in with wallet - show prompt
  if (!window.walletConnection.isSignedIn()) {
    // Sign-in flow will reload the page later
    return SignInPrompt();
  } else {
    // Get blockchian state once on component load
    React.useEffect(() => {
      viewBlockchainState()
        .then(val => setValueFromBlockchain(val));
    }, []);
  }

  const updateMessage = (message) => {
    setUiPleaseWait(true);
    callSmartContractFunction(message).then(() =>
      {
        viewBlockchainState()
          .then(val => {
            setValueFromBlockchain(val);
            setUiPleaseWait(false);
          });
      });
  }

  return (
    <>
      <SignOutButton/>
      <main className={uiPleaseWait && 'please-wait'}>
        <h1>{valueFromBlockchain}</h1>

        <div className='change'>
          <button onClick={() => updateMessage('Top of the Mornin!')}>
            Change greeting to<br/> <span>'Top of the Mornin!'</span>
          </button>
          <button onClick={() => updateMessage('Go Team!')}>
            Change greeting to<br/> <span>'Go Team!'</span>
          </button>
        </div>

        <NearInformation message={valueFromBlockchain}/>

        <EducationalText/>
      </main>
    </>
  )
}
