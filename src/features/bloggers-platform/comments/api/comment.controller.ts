import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/query/comments.query.repository';
import { JwtAuthGuard } from '../../../../core/guards/passport/guards/jwt.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { ValidateObjectIdPipe } from '../../../../core/pipes/validation.input.data.pipe';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';
import { ExtractUserFromRequest } from '../../../../core/decorators/param/validate.user.decorators';
import { UserJwtPayloadDto } from '../../../../core/guards/passport/strategies/refresh.strategy';
import { UpdateCommentApiDto } from '../dto/api/update.content.comment.dto';
import { UpdateCommentCommandApiDto } from '../dto/api/update.statuses.comment.dto';
import { UpdateContentCommentCommand } from '../application/usecases/update-comment.usecase';
import { UpdateStatusCommentCommand } from '../application/usecases/like-comment.usecase';

@Controller('/comments')
export class CommentController {
    constructor(
        private readonly commentsQueryRepository: CommentsQueryRepository,
        private readonly commandBus: CommandBus,
    ) {}
    @UseGuards(JwtAuthGuard)
    @Get('/:commentId')
    async getComment(@Param('commentId', ValidateObjectIdPipe) id: string) {
        return this.commentsQueryRepository.getComment(id);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    @Put('/:commentId')
    async updateComment(@Param('commentId', ValidateObjectIdPipe) id: string, @Body() dto: UpdateCommentApiDto) {
        return this.commandBus.execute(new UpdateContentCommentCommand(id, dto.content));
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    @Put('/:commentId/like-status')
    async likeComment(@Param('commentId', ValidateObjectIdPipe) id: string, @Body() dto: UpdateCommentCommandApiDto) {
        return this.commandBus.execute(new UpdateStatusCommentCommand(id, dto.likeStatus));
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    @Delete('/:commentId')
    async deleteComment(@Param('commentId', ValidateObjectIdPipe) id: string, @ExtractUserFromRequest() dtoUser: UserJwtPayloadDto) {
        return this.commandBus.execute(new DeleteCommentCommand(id, dtoUser.userId));
    }
}
