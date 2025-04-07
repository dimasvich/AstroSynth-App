import { Injectable } from '@nestjs/common';
import { Zodiac } from './zodiac_signs.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignDto } from './zodiac_signs.dto';
import { ZonedDateTime, ZoneId } from '@js-joda/core';
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class ZodiacSignsService {
    constructor(
        @InjectModel(Zodiac.name) private zodiacModel: Model<Zodiac>,
    ) { }
    loadSignSvgByName(dir:string){
        const directoryPath = path.resolve(__dirname, `../../src/files/signs_big/${dir}.svg`);
        return fs.readFileSync(directoryPath, 'utf-8')
    }

    async getZodiacData(body: SignDto){
        try {
            const {sign} = body;

            const element = await this.zodiacModel.findOne({Sign:sign}).lean();
              console.log(element)
              if (element){
                const signContent = this.loadSignSvgByName(element.Sign);

                return {
                  ...element,
                  svgImage: signContent
                }
              }
        } catch (error) {
            console.log(error);
        }
    }
}
