type Props = { errors: string[] };

const FormValidationErrors = ({ errors }: Props) => {
  return (
    <ul className='text-sm text-red-500'>
      {errors.map((error, index) => (
        <li key={index}>
          <span>{error}</span>
        </li>
      ))}
    </ul>
  );
};

export default FormValidationErrors;
