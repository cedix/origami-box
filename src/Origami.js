import React from "react";
import CardSleeveFullTemplate from "./CardSleeveFullTemplate.js";
// import MasuTemplate from "./MasuTemplate.js";
import { jsPDF } from "jspdf";
import { TwitterPicker } from "react-color";
import { withTranslation } from "react-i18next";

class Origami extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageFormat: "A4-p",
      pageLength: 297,
      pageWidth: 210,
      length: 60,
      width: 30,
      height: 10,
      frontText: "",
      background: "#8ED1FC",
    };

    this.updatePageFormat = this.updatePageFormat.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleBackgroundColorChange = this.handleBackgroundColorChange.bind(
      this
    );
    this.generatePdf = this.generatePdf.bind(this);
  }

  updatePageFormat() {
    if (this.state.pageFormat === "A4-p") {
      this.setState({ pageLength: 210, pageWidth: 297 });
    } else {
      this.setState({ pageLength: 297, pageWidth: 210 });
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    if (name === "pageFormat") {
      this.updatePageFormat();
    }
  }

  handleBackgroundColorChange(color) {
    this.setState({ background: color.hex });
  }

  generatePdf() {
    var orientation = this.state.pageFormat === "A4-p" ? "p" : "l";
    const pdf = new jsPDF(orientation, "mm", "A4");

    const l = parseFloat(this.state.length);
    const w = parseFloat(this.state.width);
    const h = parseFloat(this.state.height);

    const max = l + 0.0 + w + 4.0 * h;

    const l_2 = l / 2.0;
    const w_2 = w / 2.0;
    const max_2 = max / 2.0;

    const h2 = h * 2.0;

    const matrix =
      "1 0 0 1 " +
      ((this.state.pageWidth / 2.0) * 72) / 25.4 +
      " " +
      ((-this.state.pageLength / 2.0) * 72) / 25.4;
    pdf.setCurrentTransformationMatrix(matrix);
    pdf.setDrawColor("#000000");

    // Cut
    pdf.setLineWidth(0.2);
    pdf.lines(
      [
        [max_2, max_2],
        [-max_2, max_2],
        [-max_2, -max_2],
        [max_2, -max_2],
      ],
      0,
      -max_2
    );

    // Flip
    pdf.setLineDashPattern([4, 2]);
    pdf.line(-w_2 - h, -l_2 - h, w_2 + h, -l_2 - h);
    pdf.line(-w_2 - h2, -l_2, w_2 + h2, -l_2);
    pdf.line(-w_2 - h2, l_2, w_2 + h2, l_2);
    pdf.line(-w_2 - h, l_2 + h, w_2 + h, l_2 + h);
    pdf.line(-w_2 - h, -l_2 - h, -w_2 - h, l_2 + h);
    pdf.line(-w_2, -l_2 - h2, -w_2, l_2 + h2);
    pdf.line(w_2, -l_2 - h2, w_2, l_2 + h2);
    pdf.line(w_2 + h, -l_2 - h, w_2 + h, l_2 + h);

    // Inverted
    pdf.setLineDashPattern([2, 4]);
    pdf.line(-w_2, -l_2 - h2, w_2, -l_2 - h2);
    pdf.line(-w_2, l_2 + h2, w_2, l_2 + h2);
    pdf.line(-w_2 - h2, -l_2, -w_2 - h2, l_2);
    pdf.line(w_2 + h2, -l_2, w_2 + h2, l_2);
    pdf.line(-w_2 - h, -l_2 - h, -w_2, -l_2);
    pdf.line(w_2 + h, -l_2 - h, w_2, -l_2);
    pdf.line(-w_2 - h, l_2 + h, -w_2, l_2);
    pdf.line(w_2 + h, l_2 + h, w_2, l_2);

    // Verso
    pdf.addPage(orientation, "mm", "A4");
    pdf.setCurrentTransformationMatrix(matrix);

    // Background
    if (this.state.background !== null) {
      pdf.setFillColor(this.state.background);
      pdf.lines(
        [
          [max_2 + 5, max_2 + 5],
          [-max_2 - 5, max_2 + 5],
          [-max_2 - 5, -max_2 - 5],
          [max_2 + 5, -max_2 - 5],
        ],
        0,
        -max_2 - 5,
        [1, 1],
        "F"
      );
    }

    // Text
    if (this.state.frontText != null) {
      pdf.setFontSize((8 * 72) / 25.4);
      pdf.text(this.state.frontText, 0, l_2 + h / 2, {
        align: "center",
        baseline: "middle",
      });
    }

    pdf.save("test.pdf");
  }

  render() {
    const { t } = this.props;
    return (
      <div className="container">
        <h1>{t("masu.title")}</h1>
        <div className="row">
          {/* Settings */}
          <div className="mb-3 col-md-6 col-lg-4">
            <form>
              {/* Format */}
              <div className="mb-3">
                <label htmlFor="pageFormat" className="form-label">
                  {t("origami.format.label")}
                </label>
                <select
                  name="pageFormat"
                  className="form-select"
                  value={this.state.pageFormat}
                  onChange={this.handleInputChange}
                >
                  <option value="A4-p">{t("origami.format.A4p")}</option>
                  <option value="A4-l">{t("origami.format.A4l")}</option>
                </select>
              </div>
              {/* Dimensions */}
              <div className="mb-3">
                <label htmlFor="length" className="form-label">
                  {t("origami.dimensions.label")}
                </label>
                <div className="input-group">
                  <input
                    name="length"
                    type="number"
                    className="form-control"
                    placeholder={t("origami.dimensions.length")}
                    aria-label={t("origami.dimensions.length")}
                    value={this.state.length}
                    onChange={this.handleInputChange}
                  />
                  <input
                    name="width"
                    type="number"
                    className="form-control"
                    placeholder={t("origami.dimensions.width")}
                    aria-label={t("origami.dimensions.width")}
                    value={this.state.width}
                    onChange={this.handleInputChange}
                  />
                  <input
                    name="height"
                    type="number"
                    className="form-control"
                    placeholder={t("origami.dimensions.height")}
                    aria-label={t("origami.dimensions.height")}
                    value={this.state.height}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              {/* Text */}
              <div className="mb-3">
                <label htmlFor="frontText" className="form-label">
                  {t("origami.frontText.label")}
                </label>
                <input
                  name="frontText"
                  type="text"
                  className="form-control"
                  value={this.state.frontText}
                  onChange={this.handleInputChange}
                />
              </div>
              {/* Color */}
              <div className="mb-3">
                <label htmlFor="backgroundColor" className="form-label">
                  {t("origami.backgroundColor.label")}
                </label>
                <TwitterPicker
                  name="backgroundColor"
                  triangle="hide"
                  width="312px"
                  colors={[
                    "#FFFFFF",
                    "#FF6900",
                    "#FCB900",
                    "#7BDCB5",
                    "#00D084",
                    "#8ED1FC",
                    "#0693E3",
                    "#ABB8C3",
                    "#EB144C",
                    "#F78DA7",
                    "#9900EF",
                  ]}
                  color={this.state.backgroundColor}
                  onChangeComplete={this.handleBackgroundColorChange}
                />
              </div>
              {/* PDF generation */}
              <div className="pt-3 mb-6">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.generatePdf}
                >
                  {t("origami.generatePDF")}
                </button>
              </div>
            </form>
          </div>
          {/* Origami rendering */}
          <div className="col-md-6 col-lg-8">
            <ul className="nav nav-tabs" role="tablist">
              {/* Recto */}
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link active"
                  id="recto-tab"
                  data-bs-toggle="tab"
                  href="#recto"
                  role="tab"
                  aria-controls="recto"
                  aria-selected="true"
                >
                  {t("origami.recto")}
                </a>
              </li>
              {/* Verso */}
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  id="verso-tab"
                  data-bs-toggle="tab"
                  href="#verso"
                  role="tab"
                  aria-controls="verso"
                  aria-selected="false"
                >
                  {t("origami.verso")}
                </a>
              </li>
            </ul>
            <div className="tab-content">
              <div
                className="tab-pane fade show active"
                id="recto"
                role="tabpanel"
                aria-labelledby="recto-tab"
              >
                <CardSleeveFullTemplate
                  side="recto"
                  pageLength={this.state.pageLength}
                  pageWidth={this.state.pageWidth}
                  length={this.state.length}
                  width={this.state.width}
                  height={this.state.height}
                />
              </div>
              <div
                className="tab-pane fade"
                id="verso"
                role="tabpanel"
                aria-labelledby="verso-tab"
              >
                <CardSleeveFullTemplate
                  side="verso"
                  pageLength={this.state.pageLength}
                  pageWidth={this.state.pageWidth}
                  length={this.state.length}
                  width={this.state.width}
                  height={this.state.height}
                  frontText={this.state.frontText}
                  background={this.state.background}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Origami);
