import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/query/comments.query.repository';
import { JwtAuthGuard } from '../../../../core/guards/passport/guards/jwt.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { ValidateObjectIdPipe } from '../../../../core/pipes/validation.input.data.pipe';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';
import { ExtractAnyUserFromRequest, ExtractUserFromRequest } from '../../../../core/decorators/param/validate.user.decorators';
import { UserJwtPayloadDto } from '../../../user-accounts/strategies/refresh.strategy';
import { UpdateCommentApiDto } from '../dto/api/update.content.comment.dto';
import { UpdateCommentCommandApiDto } from '../dto/api/update.statuses.comment.dto';
import { UpdateContentCommentCommand } from '../application/usecases/update-comment.usecase';
import { UpdateStatusCommentCommand } from '../application/usecases/like-comment.usecase';
import { JwtOptionalAuthGuard } from '../../../../core/guards/optional/jwt-optional-auth.guard';

@Controller('/comments')
export class CommentController {
    constructor(
        private readonly commentsQueryRepository: CommentsQueryRepository,
        private readonly commandBus: CommandBus,
    ) {}
    @UseGuards(JwtOptionalAuthGuard)
    @Get('/:commentId')
    async getComment(@Param('commentId', ValidateObjectIdPipe) id: string, @ExtractAnyUserFromRequest() dtoUser: UserJwtPayloadDto) {
        const userId = dtoUser ? dtoUser.userId : null;
        return this.commentsQueryRepository.getComment(id, userId);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    @Put('/:commentId')
    async updateComment(
        @Param('commentId', ValidateObjectIdPipe) id: string,
        @Body() dto: UpdateCommentApiDto,
        @ExtractUserFromRequest() dtoUser: UserJwtPayloadDto,
    ) {
        return this.commandBus.execute(new UpdateContentCommentCommand(id, dto.content, dtoUser.userId));
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    @Put('/:commentId/like-status')
    async likeComment(
        @Param('commentId', ValidateObjectIdPipe) id: string,
        @Body() dto: UpdateCommentCommandApiDto,
        @ExtractUserFromRequest() dtoUser: UserJwtPayloadDto,
    ) {
        return this.commandBus.execute(new UpdateStatusCommentCommand(id, dto.likeStatus, dtoUser.userId));
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    @Delete('/:commentId')
    async deleteComment(@Param('commentId', ValidateObjectIdPipe) id: string, @ExtractUserFromRequest() dtoUser: UserJwtPayloadDto) {
        return this.commandBus.execute(new DeleteCommentCommand(id, dtoUser.userId));
    }
}
