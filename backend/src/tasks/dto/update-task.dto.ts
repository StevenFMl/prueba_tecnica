import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsBoolean()
    @IsOptional()
    completed?: boolean;
}
