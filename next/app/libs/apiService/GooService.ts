import axios from 'axios';
import { AxiosResponse } from 'axios';
import SplitText from '../utility/splitText';

export type HiraganaAPIParams = {
  app_id: string;
  sentence: string;
  output_type: string;
};

export type HiraganaAPIResponse = {
  request_id: string;
  output_type: string;
  converted: string;
};

export default class GooService {
  private static readonly aplicationId = `${process.env.GOO_APLICATION_ID}`;
  private static readonly url = `${process.env.GOO_HIRAGANA_API_URL}`;
  private static readonly outPutType = 'hiragana';

  public static async getHiraganaTextArray(textArray: string[]): Promise<string[]> {
    const joinText = textArray.join(',');
    const params: HiraganaAPIParams = {
      app_id: this.aplicationId,
      sentence: joinText,
      output_type: this.outPutType,
    };

    const response: AxiosResponse<HiraganaAPIParams> = await axios.post(this.url, params);
    return SplitText(response.data.sentence);
  }
}
