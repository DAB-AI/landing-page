import { test } from 'node:test';
import assert from 'node:assert/strict';
import { legalConfig, missingLegalFields, requiredLegalFields, hasApprovedLegalData } from '../src/config/legal.ts';
import { privacyContent, isPrivacyApproved, privacyStatus } from '../src/content/privacy.ts';

test('legal: approval requires all four real values and explicit owner approval', () => {
  assert.deepEqual(missingLegalFields(legalConfig), []);
  assert.equal(hasApprovedLegalData(legalConfig), true);
  assert.equal(hasApprovedLegalData({...legalConfig, ownerApproved:false}), false);
  for (const field of requiredLegalFields) {
    for (const invalid of ['', '   ', 'TODO', 'PENDIENTE', '[NOMBRE]', 'ejemplo', undefined]) {
      assert.equal(hasApprovedLegalData({...legalConfig, [field]:invalid}), false, `${field}: ${invalid}`);
    }
  }
  assert.equal(hasApprovedLegalData({...legalConfig, whatsappNumberHolder:'+527223579869'}), false);
});
test('privacy: approved notice covers actual processing, providers and ARCO', () => {
  assert.equal(isPrivacyApproved, true);
  assert.equal(privacyStatus, 'APPROVED');
  const text = JSON.stringify(privacyContent);
  for (const value of [legalConfig.ownerFullName, legalConfig.noticeAddress, legalConfig.arcoInitialResponsible, legalConfig.arcoEmail, legalConfig.whatsappBusiness, 'Vercel', 'Simple Analytics', 'Google', '12 meses', 'memoria', 'revocar', 'https://dabtech.me/privacidad/']) assert.ok(text.includes(value), value);
  assert.ok(!/TODO|PENDIENTE|\[NOMBRE/.test(text));
  assert.equal(privacyContent.version, 'R7.2');
});
