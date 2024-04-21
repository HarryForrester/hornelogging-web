import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Row, Col } from 'react-bootstrap';

/*
 * InfoCard component displays details about the person along with a image
 * @param {} param0
 * @returns
 */
const InfoCard = ({ data, imageSrc }) => {
  return (
    <Card>
      <Card.Header>Details</Card.Header>
      <Card.Body>
        <Row>
          <Col xs={8}>
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
          </Col>
          <Col xs={4} className="d-flex justify-content-center align-items-center">
            <Image
              src={imageSrc}
              style={{ width: '150px', border: '1px solid #000', borderRadius: '10%' }}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

InfoCard.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired
    })
  ).isRequired,
  imageSrc: PropTypes.string.isRequired
};

export default InfoCard;
