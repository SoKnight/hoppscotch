import { gravatarURL } from './gravatar';

const expectedURL =
  'https://gravatar.com/avatar/aa89ecce310d175be592e440a1b1461ec297675bcb75674c52baecbb3525b720?s=256&d=mp';

describe('gravatarURL', () => {
  test('should build URL from sha256 of the email', () => {
    expect(gravatarURL('dwight@dundermifflin.com')).toBe(expectedURL);
  });

  test('should normalize case and surrounding whitespace', () => {
    expect(gravatarURL('  Dwight@DunderMifflin.COM \n')).toBe(expectedURL);
  });

  test.each([null, undefined, '', '   '])(
    'should return null for empty email %p',
    (email) => {
      expect(gravatarURL(email)).toBeNull();
    },
  );
});
