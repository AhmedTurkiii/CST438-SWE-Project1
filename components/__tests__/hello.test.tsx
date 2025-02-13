// Jest test
import NewPage from '@/app/(tabs)/hello';
import { render } from '@testing-library/react-native';

test('renders NewPage correctly', () => {
  const { getByText } = render(<NewPage />);
  expect(getByText('Hello, this is a new page!')).toBeTruthy();
});

