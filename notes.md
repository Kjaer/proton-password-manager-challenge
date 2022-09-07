# Proton — Senior Frontend Engineer Challenge
> Author: [Halil Kayer](https://github.com/Kjaer)

## Decision-Making

This has been an interesting challenge, I have done in a while. After I read through carefully instructions, 
I decided to go for MVP solution. Definition of MVP to me, a decent working software of which user can use
the provided functionality of 
 - login to password storage app
 - add new passwords
 - list passwords and select between passwords
 - edit/remove passwords

The version I'd like to deliver also has as less coding-error as it should. So In order to achieve this goal,
I picked the issues/improvements list below:
- _Currently, the application does not compile when running `npm start`. It should compile and run in development mode when running `npm start`._
- _When I add a password and save it, then refresh my browser, I can't see the password that I just created any more. Passwords and modifications to them should be persisted so that I can still see my passwords after refreshing or revisiting after having closed my browser._
- _There should be no errors showing up in the console._
- _In the password edit view, when I add new url items they don't appear in the list of urls while editing. After saving and clicking on edit again they do appear. They should appear while I'm adding them inside the password edit view._
- _In the password edit view, when trying to delete one of the urls for a given password by clicking the 'x' icon on one of the url list items, nothing happens. The url for which the 'x' icon was clicked should be deleted._
- _Implement encryption for the locally stored passwords based on the master password. (crypto related)_

So I targeted my goal before I started the clock, read through the codebase to gain basic understanding. Because
without coming up with a gameplan, I would probably fail to deliver this list 4 hours.\

To be honest, it took a little more than 4 hours but overall I respect time constraints.

## Remarks

Before I state some explanation, I'd like to mention that I used `npm` as a package manager. That's why you are seeing
`package-lock.json`. I kept `yarn.lock` file too but if you try to run app with yarn lock, I may not guarantee it's
working, due to `yarn.lock` file does not contain recent changes on the `package.json`. I strongly recommend you to
install, build and run this app via `npm` (preferably `v8.15.0`)

1 - I start with fixing broken `npm start` command. I had to fix following 3 problems in order to spin up app locally
and see the app in browser screen.

  1.1 - **Crypto support fix.** I am using node.js version `18.7` and node.js switched OpenSSL 3.0 from OpenSSL 1.1.1
thus cause the error below when I ran `npm start`
```shell
Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:71:19)
    at Object.createHash (node:crypto:133:10)
    at module.exports (/Users/halilkayer/playground/proton-test-for-sending/node_modules/webpack/lib/util/createHash.js:135:53)
    at NormalModule._initBuildHash (/Users/halilkayer/playground/proton-test-for-sending/node_modules/webpack/lib/NormalModule.js:417:16)
    at /Users/halilkayer/playground/proton-test-for-sending/node_modules/webpack/lib/NormalModule.js:452:10
    at /Users/halilkayer/playground/proton-test-for-sending/node_modules/webpack/lib/NormalModule.js:323:13
    at /Users/halilkayer/playground/proton-test-for-sending/node_modules/loader-runner/lib/LoaderRunner.js:367:11
    at /Users/halilkayer/playground/proton-test-for-sending/node_modules/loader-runner/lib/LoaderRunner.js:233:18
    at context.callback (/Users/halilkayer/playground/proton-test-for-sending/node_modules/loader-runner/lib/LoaderRunner.js:111:13)
    at /Users/halilkayer/playground/proton-test-for-sending/node_modules/babel-loader/lib/index.js:59:103 {
  opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],
  library: 'digital envelope routines',
  reason: 'unsupported',
  code: 'ERR_OSSL_EVP_UNSUPPORTED'
```
This was easy to fix, because node.js mentioned on their release notes on v17 and also it's common in internet.

**Relevant node.js Release Notes**
> While OpenSSL 3.0 APIs should be mostly compatible with those provided by OpenSSL 1.1.1, 
> we do anticipate some ecosystem impact due to tightened restrictions on the allowed algorithms and key sizes. 
> If you hit an ERR_OSSL_EVP_UNSUPPORTED error in your application with Node.js 17, 
> it’s likely that your application or a module you’re using is attempting to use an algorithm or 
> key size which is no longer allowed by default with OpenSSL 3.0. A command-line option, --openssl-legacy-provider, 
> has been added to revert to the legacy provider as a temporary workaround for these tightened restrictions.

**Resource that I have used:**
  - https://stackoverflow.com/a/69699772/5018572
  - https://roytuts.com/how-to-fix-err_ossl_evp_unsupported-in-react-js-application/
  - https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V17.md#openssl-30

  1.2 - **Missing dependency.** `clsx` dependency is missing on the `package.json`. I just installed it and it's worked.

  1.3 - **import type problem.** after fixing the issues above, this problem came out of nowhere. At first, I thought
It's related to prettier, but turned out it's related to older version of `Typescript`. This is the error output in console:
```shell
/Users/halilkayer/proton-test/node_modules/pretty-format/build/index.d.ts
TypeScript error in /Users/halilkayer/proton-test/node_modules/pretty-format/build/index.d.ts(7,13):
'=' expected.  TS1005

     5 |  * LICENSE file in the root directory of this source tree.
     6 |  */
  >  7 | import type { NewPlugin, Options, OptionsReceived } from './types';
       |             ^
     8 | export type { Colors, CompareKeys, Config, Options, OptionsReceived, OldPlugin, NewPlugin, Plugin, Plugins, PrettyFormatOptions, Printer, Refs, Theme, } from './types';
```
Typescript upgrade, will solve the problem. Current typescript version is 3.7.2 and I upgraded it to 3.8.3.
I found this solution here: https://github.com/facebook/create-react-app/issues/8717#issuecomment-604145928
This one actually take me some time but not hours. Yet this is sorta trickey to solve.

2 - After I was able to run the app locally, I used it like a user, and went through the issues (reproduce) that 
I want to work on. I started to work something simple but `App.tsx`, `PasswordMainContainer.tsx`, 
`PasswordLockedContainer.tsx` relied on encrypt/decrypt functionality. So I change my mind on the half ways and start
to work on implementing encrypt/decrypt functionality.

This has been the challenging part of all ,except the others, for me and mostly took my most time. It's because 
I am not too familiar with `Crypto` API and I have to follow breadcrumbs of how encryption and decrytion is decided.

In order to implement encrypt/decrypt functions I used this (https://github.com/mdn/dom-examples/blob/master/web-crypto/encrypt-decrypt/aes-gcm.js)
as reference.

3 - After implementing encrypt and decrypt methods, I adjusted data type for `decryptedPasswords` of `App.tsx` and
`encryptedPasswords` in the local storage. `hydratePasswords` in the `App.tsx` is designed to accept all persisted
passwords like this before:
```tsx
const encryptedPasswords = JSON.parse(storage.getItem(PASSWORDS_STORAGE_KEY));
const decryptedPasswords = JSON.parse(await decrypt(newKey, encryptedPasswords));
```
but the version I implement `encrypt` and `decrypt` is not worked like that because of the main login screen.
`encrypt` and `decrypt` also used there so I kept those two function process one password at a time. And I changed them
in the `hydratePasswords` as is:
```tsx
const encryptedPasswords = storage.getItem<{ [key: string]: EncryptedPassword }>(PASSWORDS_STORAGE_KEY);

const decryptionInProgress = Object.entries(encryptedPasswords).map(async ([passKey, passItem]) => {
    const password = await decrypt(newKey, passItem.value);

    return [
        passKey,
        {
            ...passItem,
            value: password,
        },
    ];
});

// `map` callbacks are synchronous. In order to use the async functions, like `decrypt`, in them,
// I needed to wrap `decryptionInProgress` with `Promise.all` so Promises in the map callbacks can be fulfilled.
const decryptedPasswordResolved = await Promise.all(decryptionInProgress);
const decryptedPasswords = Object.fromEntries(decryptedPasswordResolved);

setDecryptedPasswords(decryptedPasswords);
```
Basically, I created a list of persisted passwords where in the `localStorage` and process them as a list via `Promise.all`
Then convert them back into data type (object) which they are before and set the decrypted passwords state (`setDecryptedPasswords`)

4 - I changed the `sync` function in the `useEffect` of `App.tsx` so it will be invoked whenever new password added to
the `decryptedPasswords`.

5 - **Console error clean up.** Following steps are the fixing errors that are reporting to browser developer tools.

 5.1 - I added default values for password form, so there will be no uncontrolled/controlled errors happening.
 5.2 - I added `handleUrlChange` as `useCallback` because it's added to `UrlList` component So it has to stay as is,
 between re-renders of `PasswordEdit`. 
 5.3 - I added `values.url` as dependency for `handleUrlChange` and `handeUrlDelete` 
 because they also cache the state value used on the callback function body. 
 5.4 - Last fix is, **Fixing the shallow** comparison by creating new `url` array everytime, add, remove and change. 
 So it triggers React.Memo properly.
 BONUS: I refactored little `PasswordItem` in the `Passwords` so It does not create multiple `handleClick`.

## Conclusion

My goal for this challenge is to provide a decent working version of the password storage application. 
Changes/refactorings/fixes introduced and explained above result,
 - working login screen with only given password, and won't login with other password
 - user can add new passwords 
 - user can delete/edit existing passwords,
   - user can change title, password, description
   - user can add remove new URLs in the URL list
 - If user logs out and login passwords are not dissappear,
 - If user refresh page or close then open back the page, previously saved passwords are retrieved.
 - Password are kept as encrypted in the storage and decrypted via master password.

I am glad that I was part of this challenge and I am struggled :) I hope you find my version useful.

