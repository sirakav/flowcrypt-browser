/* ©️ 2016 - present FlowCrypt a.s. Limitations apply. Contact human@flowcrypt.com */

import test from 'ava';
import { expect } from 'chai';

import { Config, TestVariant, Util } from './../util';

import { BrowserRecipe } from './tooling/browser-recipe';
import { ComposePageRecipe } from './page-recipe/compose-page-recipe';
import { PageRecipe } from './page-recipe/abstract-page-recipe';
import { SettingsPageRecipe } from './page-recipe/settings-page-recipe';
import { TestWithBrowser } from './../test';
import { InboxPageRecipe } from './page-recipe/inbox-page-recipe';
import { OauthPageRecipe } from './page-recipe/oauth-page-recipe';
import { testConstants } from './tooling/consts';
import { SetupPageRecipe } from './page-recipe/setup-page-recipe';
import { KeyUtil } from '../core/crypto/key';
import { ElementHandle } from 'puppeteer';
import { expectRecipientElements } from './compose';
import { GoogleData } from '../mock/google/google-data';

// these tests are run serially, one after another, because they are somewhat more sensitive to parallel testing
// eg if they are very cpu-sensitive (create key tests)

export const defineFlakyTests = (testVariant: TestVariant, testWithBrowser: TestWithBrowser) => {
  if (testVariant !== 'CONSUMER-LIVE-GMAIL') {
    test(
      'compose - own key expired - update and retry',
      testWithBrowser(undefined, async (t, browser) => {
        const expiredKey = testConstants.expiredPrv;
        const validKey =
          '-----BEGIN PGP PRIVATE KEY BLOCK-----\nVersion: FlowCrypt 7.0.1 Gmail Encryption\nComment: Seamlessly send and receive encrypted email\n\n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\nGw==\n=18AI\n-----END PGP PRIVATE KEY BLOCK-----';
        // Setup Expired key
        const settingsPage = await BrowserRecipe.openSettingsLoginApprove(t, browser, 'flowcrypt.test.key.new.manual@gmail.com');
        await settingsPage.waitAndClick('@action-step0foundkey-choose-manual-enter');
        await settingsPage.waitAndClick('@input-step2bmanualenter-source-paste');
        await settingsPage.type('@input-step2bmanualenter-ascii-key', expiredKey);
        await settingsPage.type('@input-step2bmanualenter-passphrase', 'qweasd');
        await settingsPage.waitAndClick('@input-step2bmanualenter-save');
        await SettingsPageRecipe.waitForModalAndRespond(settingsPage, 'confirm', {
          contentToCheck: 'You are importing a key that is expired.',
          clickOn: 'confirm',
        });
        await SettingsPageRecipe.waitForModalAndRespond(settingsPage, 'warning', {
          contentToCheck: 'Public key not usable - not sumbitting to Attester',
          clickOn: 'confirm',
        });
        await settingsPage.waitAndClick('@action-step4done-account-settings');
        // Try To send message with expired key
        let composePage = await ComposePageRecipe.openStandalone(t, browser, 'flowcrypt.test.key.new.manual@gmail.com');
        await ComposePageRecipe.fillMsg(composePage, { to: 'human@flowcrypt.com' }, 'Own Key Expired');
        await composePage.waitAndClick('@action-send');
        await ComposePageRecipe.waitForModalAndRespond(composePage, 'warning', {
          contentToCheck: 'Failed to send message due to: Error: Your account keys are expired',
          timeout: 45,
          clickOn: 'confirm',
        });
        await composePage.close();
        await SettingsPageRecipe.toggleScreen(settingsPage, 'additional');
        await settingsPage.waitAndClick('@action-show-key-0');
        const urls = await settingsPage.getFramesUrls(['my_key.htm'], { appearIn: 5 });
        await settingsPage.close();
        // Updating the key to valid one
        const updatePrvPage = await browser.newPage(t, urls[0]);
        await updatePrvPage.waitAndClick('@action-update-prv');
        await updatePrvPage.waitAndType('@input-prv-key', validKey);
        await updatePrvPage.type('@input-passphrase', 'qweasd');
        await updatePrvPage.waitAndClick('@action-update-key');
        await PageRecipe.waitForModalAndRespond(updatePrvPage, 'confirm', { clickOn: 'confirm' });
        await updatePrvPage.close();
        // Try send message again
        composePage = await ComposePageRecipe.openStandalone(t, browser, 'flowcrypt.test.key.new.manual@gmail.com');
        await ComposePageRecipe.fillMsg(composePage, { to: 'human@flowcrypt.com' }, 'Own Key Expired no more');
        await ComposePageRecipe.sendAndClose(composePage);
      })
    );

    test(
      'setup - create key - with backup to inbox',
      testWithBrowser(undefined, async (t, browser) => {
        const settingsPage = await BrowserRecipe.openSettingsLoginApprove(t, browser, 'flowcrypt.test.key.new.manual@gmail.com');
        await SetupPageRecipe.createKey(
          settingsPage,
          'flowcrypt.test.key.used.pgp',
          'email',
          { submitPubkey: true, usedPgpBefore: true },
          { isSavePassphraseChecked: false, isSavePassphraseHidden: false }
        );
      })
    );

    test(
      'setup - create key - choose no backup',
      testWithBrowser(undefined, async (t, browser) => {
        const settingsPage = await BrowserRecipe.openSettingsLoginApprove(t, browser, 'flowcrypt.test.key.new.manual@gmail.com');
        await SetupPageRecipe.createKey(
          settingsPage,
          'flowcrypt.test.key.used.pgp',
          'none',
          { submitPubkey: false, usedPgpBefore: true },
          { isSavePassphraseChecked: false, isSavePassphraseHidden: false }
        );
      })
    );

    test(
      'setup - create key - backup as file - submit pubkey',
      testWithBrowser(undefined, async (t, browser) => {
        const settingsPage = await BrowserRecipe.openSettingsLoginApprove(t, browser, 'flowcrypt.test.key.new.manual@gmail.com');
        await SetupPageRecipe.createKey(
          settingsPage,
          'flowcrypt.test.key.used.pgp',
          'file',
          { submitPubkey: true, usedPgpBefore: true },
          { isSavePassphraseChecked: false, isSavePassphraseHidden: false }
        );
      })
    );

    test(
      'create@prv-create-no-prv-backup.flowcrypt.test - create key allowed but backups not',
      testWithBrowser(undefined, async (t, browser) => {
        const settingsPage = await BrowserRecipe.openSettingsLoginApprove(t, browser, 'setup@prv-create-no-prv-backup.flowcrypt.test');
        await SetupPageRecipe.createKey(
          settingsPage,
          'flowcrypt.test.key.used.pgp',
          'disabled',
          { submitPubkey: false, usedPgpBefore: false, enforcedAlgo: 'rsa2048' },
          { isSavePassphraseChecked: false, isSavePassphraseHidden: false }
        );
      })
    );

    test(
      'compose - reply all - from === acctEmail',
      testWithBrowser('compatibility', async (t, browser) => {
        const appendUrl = 'threadId=17d02296bccd4c5c&skipClickPrompt=___cu_false___&ignoreDraft=___cu_false___&replyMsgId=17d02296bccd4c5c';
        const composePage = await ComposePageRecipe.openStandalone(t, browser, 'compatibility', {
          appendUrl,
          hasReplyPrompt: true,
        });
        await composePage.waitAndClick('@action-accept-reply-all-prompt', { delay: 1 });
        await expectRecipientElements(composePage, {
          to: [{ email: 'flowcrypt.compatibility@gmail.com', name: 'First Last' }, { email: 'vladimir@flowcrypt.com' }],
          cc: [{ email: 'limon.monte@gmail.com' }],
          bcc: [{ email: 'sweetalert2@gmail.com' }],
        });
        await composePage.waitAndType('@input-password', 'gO0d-pwd');
        await composePage.waitAndClick('@action-send', { delay: 1 });
        // test rendering of recipients after successful sending
        await composePage.waitForContent('@replied-to', 'to: First Last <flowcrypt.compatibility@gmail.com>, vladimir@flowcrypt.com');
        await composePage.waitForContent('@replied-cc', 'cc: limon.monte@gmail.com');
        await composePage.waitForContent('@replied-bcc', 'bcc: sweetalert2@gmail.com');
      })
    );

    test(
      'user@no-submit-client-configuration.flowcrypt.test - do not submit to attester on key generation',
      testWithBrowser(undefined, async (t, browser) => {
        const settingsPage = await BrowserRecipe.openSettingsLoginApprove(t, browser, 'user@no-submit-client-configuration.flowcrypt.test');
        await SetupPageRecipe.createKey(
          settingsPage,
          'unused',
          'none',
          { key: { passphrase: 'long enough to suit requirements' }, usedPgpBefore: false },
          { isSavePassphraseChecked: false, isSavePassphraseHidden: false }
        );
        await settingsPage.notPresent('.swal2-container');
        await settingsPage.close();
      })
    );

    test(
      'settings - generate rsa3072 key',
      testWithBrowser(undefined, async (t, browser) => {
        const acctEmail = 'user@no-submit-client-configuration.flowcrypt.test';
        const settingsPage = await BrowserRecipe.openSettingsLoginApprove(t, browser, acctEmail);
        await SetupPageRecipe.createKey(settingsPage, 'unused', 'none', {
          selectKeyAlgo: 'rsa3072',
          key: { passphrase: 'long enough to suit requirements' },
        });
        await SettingsPageRecipe.toggleScreen(settingsPage, 'additional');
        const fingerprint = (await settingsPage.read('.good', true)).split(' ').join('');
        const myKeyFrame = await browser.newPage(
          t,
          `chrome/settings/modules/my_key.htm?placement=settings&parentTabId=60%3A0&acctEmail=${acctEmail}&fingerprint=${fingerprint}`
        );
        const downloadedFiles = await myKeyFrame.awaitDownloadTriggeredByClicking('@action-download-prv');
        // const longid = OpenPGPKey.fingerprintToLongid(fingerprint);
        const longid = fingerprint.substring(fingerprint.length - 16);
        const fileName = `flowcrypt-backup-usernosubmitclientconfigurationflowcrypttest-0x${longid}.asc`;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const key = await KeyUtil.parse(downloadedFiles[fileName]!.toString());
        expect(key.algo.bits).to.equal(3072);
        expect(key.algo.algorithm).to.equal('rsaEncryptSign');
        await myKeyFrame.close();
        await settingsPage.close();
      })
    );

    test(
      'user4@standardsubdomainfes.localhost:8001 - PWD encrypted message with FES web portal - some sends fail with BadRequest error',
      testWithBrowser(undefined, async (t, browser) => {
        const port = t.urls?.port;
        const acct = `user4@standardsubdomainfes.localhost:${port}`; // added port to trick extension into calling the mock
        const settingsPage = await BrowserRecipe.openSettingsLoginApprove(t, browser, acct);
        await SetupPageRecipe.manualEnter(
          settingsPage,
          'flowcrypt.test.key.used.pgp',
          { submitPubkey: false, usedPgpBefore: false },
          { isSavePassphraseChecked: false, isSavePassphraseHidden: false }
        );
        // add a name to one of the contacts
        const dbPage = await browser.newExtensionPage(t, 'chrome/dev/ci_unit_test.htm');
        await dbPage.page.evaluate(async () => {
          /* eslint-disable @typescript-eslint/no-explicit-any */
          const db = await (window as any).ContactStore.dbOpen();
          await (window as any).ContactStore.update(db, 'cc@example.com', { name: 'Mr Cc' });
          /* eslint-enable @typescript-eslint/no-explicit-any */
        });
        await dbPage.close();
        const subject = 'PWD encrypted message with FES web portal - some sends fail with BadRequest error - ' + testVariant;
        let expectedNumberOfPassedMessages = (await GoogleData.withInitializedData(acct)).searchMessagesBySubject(subject).length;
        // 1. vague Gmail error with partial success
        let composePage = await ComposePageRecipe.openStandalone(t, browser, `user4@standardsubdomainfes.localhost:${port}`);
        await ComposePageRecipe.fillMsg(composePage, { to: 'to@example.com', cc: 'cc@example.com', bcc: 'flowcrypt.compatibility@gmail.com' }, subject);
        await composePage.waitAndType('@input-password', 'gO0d-pwd');
        await composePage.waitAndClick('@action-send', { delay: 1 });
        await composePage.waitAndRespondToModal(
          'confirm',
          'cancel',
          'Messages to some recipients were sent successfully, while messages to flowcrypt.compatibility@gmail.com, Mr Cc <cc@example.com> ' +
            'encountered error(s) from Gmail. Please help us improve FlowCrypt by reporting the error to us.'
        );
        await composePage.close();
        expect((await GoogleData.withInitializedData(acct)).searchMessagesBySubject(subject).length).to.equal(++expectedNumberOfPassedMessages);
        // 2. vague Gmail error with all failures
        composePage = await ComposePageRecipe.openStandalone(t, browser, `user4@standardsubdomainfes.localhost:${port}`);
        await ComposePageRecipe.fillMsg(composePage, { cc: 'cc@example.com', bcc: 'flowcrypt.compatibility@gmail.com' }, subject);
        await composePage.waitAndType('@input-password', 'gO0d-pwd');
        await composePage.waitAndClick('@action-send', { delay: 1 });
        await composePage.waitAndRespondToModal(
          'confirm',
          'cancel',
          'Google returned an error when sending message. ' + 'Please help us improve FlowCrypt by reporting the error to us.'
        );
        await composePage.close();
        expect((await GoogleData.withInitializedData(acct)).searchMessagesBySubject(subject).length).to.equal(expectedNumberOfPassedMessages); // + 0 messages
        // 3. "invalid To" Gmail error with partial success
        composePage = await ComposePageRecipe.openStandalone(t, browser, `user4@standardsubdomainfes.localhost:${port}`);
        await ComposePageRecipe.fillMsg(composePage, { to: 'invalid@example.com', cc: 'to@example.com' }, subject);
        await composePage.waitAndType('@input-password', 'gO0d-pwd');
        await composePage.waitAndClick('@action-send', { delay: 1 });
        await composePage.waitAndRespondToModal(
          'error',
          'confirm',
          'Messages to some recipients were sent successfully, while messages to invalid@example.com ' +
            'encountered error(s) from Gmail: Invalid recipients\n\nPlease remove recipients, add them back and re-send the message.'
        );
        await composePage.close();
        expect((await GoogleData.withInitializedData(acct)).searchMessagesBySubject(subject).length).to.equal(++expectedNumberOfPassedMessages);
        // 4. "invalid To" Gmail error with all failures
        composePage = await ComposePageRecipe.openStandalone(t, browser, `user4@standardsubdomainfes.localhost:${port}`);
        await ComposePageRecipe.fillMsg(composePage, { to: 'invalid@example.com', cc: 'cc@example.com' }, subject);
        await composePage.waitAndType('@input-password', 'gO0d-pwd');
        await composePage.waitAndClick('@action-send', { delay: 1 });
        await composePage.waitAndRespondToModal(
          'error',
          'confirm',
          'Error from google: Invalid recipients\n\nPlease remove recipients, add them back and re-send the message.'
        );
        await composePage.close();
        expect((await GoogleData.withInitializedData(acct)).searchMessagesBySubject(subject).length).to.equal(expectedNumberOfPassedMessages); // + 0 messages
        // 5. "RequestTimeout" error with partial success
        composePage = await ComposePageRecipe.openStandalone(t, browser, `user4@standardsubdomainfes.localhost:${port}`);
        await ComposePageRecipe.fillMsg(composePage, { to: 'timeout@example.com', cc: 'to@example.com' }, subject);
        await composePage.waitAndType('@input-password', 'gO0d-pwd');
        await composePage.waitAndClick('@action-send', { delay: 1 });
        await composePage.waitAndRespondToModal(
          'error',
          'confirm',
          'Messages to some recipients were sent successfully, while messages to timeout@example.com ' +
            'encountered network errors. Please check your internet connection and try again.'
        );
        await composePage.close();
        expect((await GoogleData.withInitializedData(acct)).searchMessagesBySubject(subject).length).to.equal(++expectedNumberOfPassedMessages);
        // 6. "RequestTimeout" error with all failures
        composePage = await ComposePageRecipe.openStandalone(t, browser, `user4@standardsubdomainfes.localhost:${port}`);
        await ComposePageRecipe.fillMsg(composePage, { to: 'timeout@example.com', cc: 'cc@example.com' }, subject);
        await composePage.waitAndType('@input-password', 'gO0d-pwd');
        await composePage.waitAndClick('@action-send', { delay: 1 });
        await composePage.waitAndRespondToModal(
          'error',
          'confirm',
          'Could not send message due to network error. Please check your internet connection and try again. ' +
            '(This may also be caused by missing extension permissions).'
        );
        await composePage.close();
        expect((await GoogleData.withInitializedData(acct)).searchMessagesBySubject(subject).length).to.equal(expectedNumberOfPassedMessages); // + 0 messages
        // this test is using PwdEncryptedMessageWithFesReplyBadRequestTestStrategy to check sent result based on subject
        // "PWD encrypted message with FES web portal - some sends fail with BadRequest error"
        // also see '/api/v1/message' in customer-url-fes-endpoints.ts mock
      })
    );

    test(
      'user@forbid-storing-passphrase-client-configuration.flowcrypt.test - do not store passphrase',
      testWithBrowser(undefined, async (t, browser) => {
        const acctEmail = 'user@forbid-storing-passphrase-client-configuration.flowcrypt.test';
        const settingsPage = await BrowserRecipe.openSettingsLoginApprove(t, browser, acctEmail);
        const passphrase = 'long enough to suit requirements';
        await SetupPageRecipe.createKey(
          settingsPage,
          'unused',
          'none',
          { key: { passphrase }, usedPgpBefore: false },
          { isSavePassphraseHidden: true, isSavePassphraseChecked: false }
        );
        await settingsPage.notPresent('.swal2-container');
        const inboxPage = await browser.newExtensionInboxPage(t, acctEmail);
        await InboxPageRecipe.finishSessionOnInboxPage(inboxPage);
        const composeFrame = await InboxPageRecipe.openAndGetComposeFrame(inboxPage);
        await ComposePageRecipe.fillMsg(composeFrame, { to: 'human@flowcrypt.com' }, 'should not send as pass phrase is not known', undefined, {
          encrypt: false,
        });
        await composeFrame.waitAndClick('@action-send');
        await inboxPage.waitAll('@dialog-passphrase');
        const passphraseDialog = await inboxPage.getFrame(['passphrase.htm']);
        await passphraseDialog.waitForContent('@lost-pass-phrase-with-ekm', 'Ask your IT staff for help if you lost your pass phrase.');
        expect(await passphraseDialog.hasClass('@forget-pass-phrase-label', 'hidden')).to.equal(true);
        expect(await passphraseDialog.isChecked('@forget-pass-phrase-checkbox')).to.equal(true);
        await inboxPage.close();
        await settingsPage.close();
      })
    );

    test(
      'standalone - different send from, new signed message, verification in mock',
      testWithBrowser('compatibility', async (t, browser) => {
        const key = Config.key('flowcryptcompatibility.from.address');
        await SettingsPageRecipe.addKeyTest(
          t,
          browser,
          'flowcrypt.compatibility@gmail.com',
          key.armored!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
          key.passphrase!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
          { isSavePassphraseChecked: true, isSavePassphraseHidden: false }
        );
        const composePage = await ComposePageRecipe.openStandalone(t, browser, 'compatibility');
        await ComposePageRecipe.selectFromOption(composePage, 'flowcryptcompatibility@gmail.com');
        await ComposePageRecipe.fillMsg(composePage, { to: 'human@flowcrypt.com' }, 'New Signed Message (Mock Test)', undefined, {
          encrypt: false,
        });
        await ComposePageRecipe.sendAndClose(composePage);
      })
    );

    test(
      'compose - test compose after reconnect account',
      testWithBrowser('ci.tests.gmail', async (t, browser) => {
        const acct = 'ci.tests.gmail@flowcrypt.test';
        const composePage = await ComposePageRecipe.openStandalone(t, browser, 'compose');
        await Util.wipeGoogleTokensUsingExperimentalSettingsPage(t, browser, acct);
        await ComposePageRecipe.showRecipientInput(composePage);
        const subject = 'PWD encrypted message after reconnect account';
        await ComposePageRecipe.fillMsg(composePage, { to: 'test@email.com' }, subject);
        await composePage.waitAndType('@input-password', 'gO0d-pwd');
        await composePage.waitAndClick('@action-send', { delay: 1 });
        const oauthPopup = await browser.newPageTriggeredBy(t, () =>
          composePage.waitAndRespondToModal('confirm', 'confirm', 'Please log in with FlowCrypt to continue')
        );
        await OauthPageRecipe.google(t, oauthPopup, acct, 'approve');
        await ComposePageRecipe.closed(composePage);
        expect((await GoogleData.withInitializedData(acct)).searchMessagesBySubject(subject).length).to.equal(1);
      })
    );

    test(
      'with attachments + shows progress %',
      testWithBrowser('compatibility', async (t, browser) => {
        const composePage = await ComposePageRecipe.openStandalone(t, browser, 'compatibility');
        await ComposePageRecipe.fillMsg(composePage, { to: 'human@flowcrypt.com' }, 'with files');
        const fileInput = (await composePage.target.$('input[type=file]')) as ElementHandle<HTMLInputElement>;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await fileInput!.uploadFile('test/samples/small.txt', 'test/samples/small.png', 'test/samples/small.pdf', 'test/samples/large.jpg');
        await ComposePageRecipe.sendAndClose(composePage, { expectProgress: true, timeout: 120 });
      })
    );

    test(
      'compose > large file > public domain account (should not prompt to upgrade)',
      testWithBrowser('compatibility', async (t, browser) => {
        const composePage = await ComposePageRecipe.openStandalone(t, browser, 'compatibility');
        await ComposePageRecipe.fillMsg(composePage, { to: 'human@flowcrypt.com' }, 'a large file test (gmail account)');
        const fileInput = (await composePage.target.$('input[type=file]')) as ElementHandle<HTMLInputElement>;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await fileInput!.uploadFile('test/samples/large.jpg');
        await Util.sleep(2);
        await ComposePageRecipe.sendAndClose(composePage, { timeout: 60, expectProgress: true });
      })
    );

    test(
      'compose - PWD encrypted message with flowcrypt.com/shared-tenant-fes',
      testWithBrowser('compatibility', async (t, browser) => {
        const msgPwd = 'super hard password for the message';
        const subject = 'PWD encrypted message with flowcrypt.com/shared-tenant-fes';
        const composePage = await ComposePageRecipe.openStandalone(t, browser, 'compatibility');
        await ComposePageRecipe.fillMsg(composePage, { to: 'test@email.com' }, subject);
        const fileInput = (await composePage.target.$('input[type=file]')) as ElementHandle<HTMLInputElement>;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await fileInput!.uploadFile('test/samples/small.txt');
        await ComposePageRecipe.sendAndClose(composePage, { password: msgPwd });
        // this test is using PwdEncryptedMessageWithFlowCryptComApiTestStrategy to check sent result based on subject "PWD encrypted message with flowcrypt.com/shared-tenant-fes"
      })
    );

    test(
      'compose - load contacts - contacts should be properly ordered',
      testWithBrowser('ci.tests.gmail', async (t, browser) => {
        const inboxPage = await browser.newExtensionInboxPage(t, 'ci.tests.gmail@flowcrypt.test');
        let composeFrame = await InboxPageRecipe.openAndGetComposeFrame(inboxPage);
        await composeFrame.type('@input-to', 'testsearchorder');
        if (testVariant === 'CONSUMER-MOCK') {
          // allow contacts scope, and expect that it will find contacts
          const oauthPopup = await browser.newPageTriggeredBy(t, () => composeFrame.waitAndClick('@action-auth-with-contacts-scope'));
          await OauthPageRecipe.google(t, oauthPopup, 'ci.tests.gmail@flowcrypt.test', 'approve');
        }
        await ComposePageRecipe.expectContactsResultEqual(composeFrame, [
          'testsearchorder1@flowcrypt.com',
          'testsearchorder2@flowcrypt.com',
          'testsearchorder3@flowcrypt.com',
          'testsearchorder4@flowcrypt.com',
          'testsearchorder5@flowcrypt.com',
          'testsearchorder6@flowcrypt.com',
          'testsearchorder7@flowcrypt.com',
          'testsearchorder8@flowcrypt.com',
        ]);
        await composeFrame.waitAndClick('@action-close-new-message');
        await inboxPage.waitTillGone('@container-new-message');
        // add key + send
        composeFrame = await InboxPageRecipe.openAndGetComposeFrame(inboxPage);
        await ComposePageRecipe.fillMsg(composeFrame, { to: 'testsearchorder3@flowcrypt.com' }, t.title);
        await ComposePageRecipe.pastePublicKeyManually(composeFrame, inboxPage, 'testsearchorder3@flowcrypt.com', testConstants.smimeCert);
        await composeFrame.waitAndClick('@action-send', { delay: 1 });
        await composeFrame.waitAndClick('.swal2-cancel');
        await composeFrame.waitAndClick('@action-close-new-message');
        await inboxPage.waitTillGone('@container-new-message');
        // add key
        composeFrame = await InboxPageRecipe.openAndGetComposeFrame(inboxPage);
        await ComposePageRecipe.fillMsg(composeFrame, { to: 'testsearchorder9@flowcrypt.com' }, t.title);
        await ComposePageRecipe.pastePublicKeyManually(composeFrame, inboxPage, 'testsearchorder9@flowcrypt.com', testConstants.smimeCert);
        await composeFrame.waitAndClick('@action-close-new-message');
        await inboxPage.waitTillGone('@container-new-message');
        // send
        composeFrame = await InboxPageRecipe.openAndGetComposeFrame(inboxPage);
        await ComposePageRecipe.fillMsg(composeFrame, { to: 'testsearchorder5@flowcrypt.com' }, t.title);
        await composeFrame.waitAndType('@input-password', 'test-pass');
        await composeFrame.waitAndClick('@action-send', { delay: 1 });
        await composeFrame.waitAndClick('.swal2-cancel');
        await composeFrame.waitAndClick('@action-close-new-message');
        await inboxPage.waitTillGone('@container-new-message');
        // check that contacts are ordered according to hasPgp and lastUse
        composeFrame = await InboxPageRecipe.openAndGetComposeFrame(inboxPage);
        await composeFrame.type('@input-to', 'testsearchorder');
        await ComposePageRecipe.expectContactsResultEqual(composeFrame, [
          'testsearchorder3@flowcrypt.com', // hasPgp + lastUse
          'testsearchorder9@flowcrypt.com', // hasPgp
          'testsearchorder5@flowcrypt.com', // lastUse
          'testsearchorder1@flowcrypt.com',
          'testsearchorder2@flowcrypt.com',
          'testsearchorder4@flowcrypt.com',
          'testsearchorder6@flowcrypt.com',
          'testsearchorder7@flowcrypt.com',
        ]);
      })
    );
    test(
      'decrypt - entering pass phrase should unlock all keys that match the pass phrase',
      testWithBrowser('compatibility', async (t, browser) => {
        const acctEmail = 'flowcrypt.compatibility@gmail.com';
        const passphrase = 'pa$$w0rd';
        await SettingsPageRecipe.addKeyTest(t, browser, acctEmail, testConstants.testkey17AD7D07, passphrase, {}, false);
        await SettingsPageRecipe.addKeyTest(t, browser, acctEmail, testConstants.testkey0389D3A7, passphrase, {}, false);
        await SettingsPageRecipe.addKeyTest(t, browser, acctEmail, testConstants.testKeyMultipleSmimeCEA2D53BB9D24871, passphrase, {}, false);
        const inboxPage = await browser.newExtensionInboxPage(t, acctEmail);
        await InboxPageRecipe.finishSessionOnInboxPage(inboxPage);
        await InboxPageRecipe.checkDecryptMsg(t, browser, {
          acctEmail,
          threadId: '17c0e50966d7877c',
          expectedContent: '1st key of of 2 keys with the same passphrase',
          enterPp: {
            passphrase,
            isForgetPpChecked: true,
            isForgetPpHidden: false,
          },
        });
        await InboxPageRecipe.checkDecryptMsg(t, browser, {
          acctEmail,
          threadId: '17c0e55caaa4abb3',
          expectedContent: '2nd key of of 2 keys with the same passphrase',
          // passphrase for the 2nd key should not be needed because it's the same as for the 1st key
        });
        // as decrypted s/mime messages are not rendered yet (#4070), let's test signing instead
        const composeFrame = await InboxPageRecipe.openAndGetComposeFrame(inboxPage);
        await ComposePageRecipe.fillMsg(composeFrame, { to: 'smime@recipient.com' }, 'send signed and encrypted S/MIME without attachment');
        await ComposePageRecipe.pastePublicKeyManually(
          composeFrame,
          inboxPage,
          'smime@recipient.com',
          testConstants.testCertificateMultipleSmimeCEA2D53BB9D24871
        );
        await composeFrame.waitAndClick('@action-send', { delay: 2 });
        await inboxPage.waitTillGone('@container-new-message');
      })
    );
  }
};
