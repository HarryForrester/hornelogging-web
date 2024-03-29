import React from 'react';

const InfoArticle = ({ data, imageSrc }) => {
  return (
    <article>
      <div style={{ float: 'right' }}></div>
      <table>
        <tbody className="group1">
          {data.map(({ label, value }) => (
            <tr key={label}>
              <th scope="row">{label}&nbsp;</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
};

export default InfoArticle;
